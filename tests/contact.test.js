/**
 * Contact form: the browser never picks the email recipient, and the spam
 * guard blocks bots, instant submissions and repeats.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sendInquiry, templateParams } from '../src/lib/contactApi.js';
import { COOLDOWN_MS, MAX_PER_WINDOW, MIN_FILL_MS, checkSubmission, readHistory, recordSubmission } from '../src/lib/spamGuard.js';

const inquiry = { name: 'Ada', email: 'ada@example.com', project: 'A new app', services: ['Websites'], budget: '$5K–$10K', brief: '' };

test('no recipient address is sent from the browser', async () => {
  const params = templateParams(inquiry);
  assert.equal('to_email' in params, false);
  assert.ok(!JSON.stringify(params).includes('strixproduction.com'));
  let body;
  await sendInquiry(inquiry, {
    captchaToken: 'token-123',
    fetchImpl: async (_url, init) => {
      body = JSON.parse(init.body);
      return { ok: true };
    },
  });
  assert.equal(body.template_params['g-recaptcha-response'], 'token-123');
  assert.equal('to_email' in body.template_params, false);
});

test('a failed delivery is reported, not swallowed', async () => {
  await assert.rejects(sendInquiry(inquiry, { fetchImpl: async () => ({ ok: false }) }), /could not be delivered/);
});

test('the spam guard blocks honeypots, instant submits, cooldowns and floods', () => {
  const now = 1_000_000_000;
  const started = now - MIN_FILL_MS - 1;
  assert.equal(checkSubmission({ honeypot: 'https://spam', startedAt: started, now, history: [] }), 'bot');
  assert.equal(checkSubmission({ honeypot: '', startedAt: now - 100, now, history: [] }), 'too-fast');
  assert.equal(checkSubmission({ honeypot: '', startedAt: started, now, history: [now - COOLDOWN_MS / 2] }), 'cooldown');
  const flood = Array.from({ length: MAX_PER_WINDOW }, (_, i) => now - COOLDOWN_MS * (i + 2));
  assert.equal(checkSubmission({ honeypot: '', startedAt: started, now, history: flood }), 'limit');
  assert.equal(checkSubmission({ honeypot: '', startedAt: started, now, history: [] }), null);
});

test('submission history survives bad or blocked storage', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.deepEqual(readHistory(storage), []);
  const history = recordSubmission(storage, [], 5);
  assert.deepEqual(readHistory(storage), history);
  store.set('strix:inquiries', '{not json');
  assert.deepEqual(readHistory(storage), []);
  assert.deepEqual(readHistory({ getItem: () => { throw new Error('blocked'); } }), []);
  assert.doesNotThrow(() => recordSubmission({ setItem: () => { throw new Error('quota'); } }, [], 1));
});
