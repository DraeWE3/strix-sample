import React, { useRef, useState } from 'react';
import { Paperclip, Check } from 'lucide-react';
import Button from './Button';
import ArrowIcon from '../assets/img/home/e23f5-hero-intro.svg';
import { sendInquiry } from '../lib/contactApi';
import { GUARD_MESSAGES, checkSubmission, readHistory, recordSubmission } from '../lib/spamGuard';
import { useRecaptcha } from '../lib/recaptcha';

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

const SERVICES = ['UI/UX design', 'Websites', 'MVP & development', 'Mobile application', 'Motion & video'];
const BUDGETS = ['Under $5K', '$5K–$10K', '$10K–$20K', '$20K+', 'Let’s discuss'];

const isValidUrl = value => {
  try {
    return /^https?:$/.test(new URL(value).protocol);
  } catch {
    return false;
  }
};

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('');
  const [brief, setBrief] = useState('');
  const [services, setServices] = useState([]);
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState({});
  const [briefOpen, setBriefOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [honeypot, setHoneypot] = useState('');
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const projectRef = useRef(null);
  const briefRef = useRef(null);
  const statusRef = useRef(null);
  const successRef = useRef(null);
  const captchaRef = useRef(null);
  const captcha = useRecaptcha(captchaRef, !submitted);

  const refs = { name: nameRef, email: emailRef, project: projectRef, brief: briefRef };

  const validateField = (field, value) => {
    if (field === 'name') return value.trim().length > 0;
    if (field === 'email') return emailRef.current?.checkValidity() ?? value.includes('@');
    if (field === 'project') return value.trim().length > 0;
    if (field === 'brief') return !value.trim() || isValidUrl(value.trim());
    return true;
  };

  const toggleService = value => {
    setServices(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));
  };

  const openBrief = () => {
    setBriefOpen(true);
    setTimeout(() => briefRef.current?.focus(), 0);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (sending) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedProject = project.trim();
    const trimmedBrief = brief.trim();
    setName(trimmedName);
    setEmail(trimmedEmail);
    setProject(trimmedProject);
    setBrief(trimmedBrief);

    const values = { name: trimmedName, email: trimmedEmail, project: trimmedProject, brief: trimmedBrief };
    const nextErrors = {};
    Object.keys(values).forEach(field => {
      if (!validateField(field, values[field])) nextErrors[field] = true;
    });
    setErrors(nextErrors);

    const invalidFields = Object.keys(nextErrors);
    if (invalidFields.length) {
      if (invalidFields.includes('brief')) openBrief();
      setStatus({ text: 'Please check the highlighted fields so we can get back to you.', state: 'error' });
      refs[invalidFields[0]]?.current?.focus();
      return;
    }

    const inquiry = { name: trimmedName, email: trimmedEmail, project: trimmedProject, services, budget, brief: trimmedBrief };
    const now = Date.now();
    const history = readHistory(storage());
    const blocked = checkSubmission({ honeypot, startedAt, now, history });
    if (blocked === 'bot') {
      // Bots get the normal success screen and nothing is sent.
      setSubmitted(inquiry);
      return;
    }
    if (blocked) {
      setStatus({ text: GUARD_MESSAGES[blocked], state: 'error' });
      setTimeout(() => statusRef.current?.focus(), 0);
      return;
    }
    const captchaToken = captcha.token();
    if (captcha.enabled && !captchaToken) {
      setStatus({ text: 'Please confirm you’re not a robot, then send again.', state: 'error' });
      setTimeout(() => statusRef.current?.focus(), 0);
      return;
    }

    setSending(true);
    setStatus(null);
    try {
      await sendInquiry(inquiry, { captchaToken });
      recordSubmission(storage(), history, now);
      setSubmitted(inquiry);
      setName('');
      setEmail('');
      setProject('');
      setBrief('');
      setServices([]);
      setBudget('');
      setErrors({});
      setBriefOpen(false);
      setTimeout(() => successRef.current?.focus(), 0);
    } catch {
      captcha.reset();
      setStatus({ text: 'error', state: 'error', inquiry });
      setTimeout(() => statusRef.current?.focus(), 0);
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setSubmitted(null);
    setStatus(null);
    setStartedAt(Date.now());
    setTimeout(() => nameRef.current?.focus(), 0);
  };

  if (submitted) {
    return (
      <section className="form-panel" aria-labelledby="success-title">
        <div className="success-panel" ref={successRef} tabIndex={-1}>
          <span className="success-mark"><Check size={28} strokeWidth={2.5} /></span>
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2 id="success-title">Great things<br />are on the way.</h2>
          <p className="success-copy">Your inquiry is in. We’ll review your project and reply to <strong>{submitted.email}</strong> with the next steps.</p>

          {(submitted.services.length > 0 || submitted.budget) && (
            <ul className="success-summary" aria-label="Your inquiry">
              {submitted.services.map(service => <li key={service}>{service}</li>)}
              {submitted.budget && <li className="is-budget">{submitted.budget}</li>}
            </ul>
          )}

          <ol className="success-steps">
            <li><span>01</span>We review your brief</li>
            <li><span>02</span>We reply by email</li>
            <li><span>03</span>We plan a discovery call</li>
          </ol>

          <div className="success-actions">
            <Button href="https://calendly.com/strix-ryvon/raj-consultation" target="_blank" rel="noopener noreferrer" text="Book a discovery call" arrow />
            <button type="button" className="success-reset" onClick={resetForm}>Send another inquiry</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="form-panel" aria-labelledby="form-title">
      <div className="form-heading">
        <div>
          <h1 id="form-title">Tell us about your project.</h1>
          <p>A new idea. A better experience. A bigger impact.</p>
        </div>
      </div>

      <form noValidate onSubmit={handleSubmit}>
        <div className="identity-row">
          <div className="field">
            <label htmlFor="name">Full name <span>*</span></label>
            <input
              id="name"
              ref={nameRef}
              autoComplete="name"
              placeholder="Your name"
              required
              maxLength={120}
              value={name}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <span className="error" id="name-error">Please enter your name.</span>}
          </div>
          <div className="field">
            <label htmlFor="email">Work email <span>*</span></label>
            <input
              id="email"
              ref={emailRef}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              required
              maxLength={254}
              value={email}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <span className="error" id="email-error">Please enter a valid email.</span>}
          </div>
        </div>

        <fieldset className="choices">
          <legend>What can we help you with? <span className="optional">Choose any</span></legend>
          <div className="chips chips-services">
            {SERVICES.map(service => (
              <label key={service}>
                <input type="checkbox" checked={services.includes(service)} onChange={() => toggleService(service)} />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="choices">
          <legend>What’s your budget? <span className="optional">USD</span></legend>
          <div className="chips budgets">
            {BUDGETS.map(option => (
              <label key={option}>
                <input type="radio" name="budget" checked={budget === option} onChange={() => setBudget(option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field project-field">
          <label htmlFor="project">About your project <span>*</span></label>
          <textarea
            id="project"
            ref={projectRef}
            rows={2}
            required
            maxLength={5000}
            placeholder="What are you building, who is it for, and what would success look like?"
            value={project}
            aria-invalid={errors.project ? 'true' : 'false'}
            aria-describedby={errors.project ? 'project-error' : undefined}
            onChange={e => setProject(e.target.value)}
          />
          {errors.project && <span className="error" id="project-error">Tell us a little about your project.</span>}
        </div>

        <div className="brief-area">
          <button
            type="button"
            className="brief-toggle"
            aria-expanded={briefOpen}
            onClick={() => (briefOpen ? setBriefOpen(false) : openBrief())}
          >
            <Paperclip size={16} />
            <span>Add a brief or reference link</span>
            <span className="optional">Optional</span>
          </button>
          {briefOpen && (
            <div className="field brief-field">
              <label className="sr-only" htmlFor="brief">Brief or reference link</label>
              <input
                id="brief"
                ref={briefRef}
                type="url"
                placeholder="https://figma.com/… or a shared document"
                maxLength={1000}
                value={brief}
                aria-invalid={errors.brief ? 'true' : 'false'}
                aria-describedby={errors.brief ? 'brief-help brief-error' : 'brief-help'}
                onChange={e => setBrief(e.target.value)}
              />
              <small id="brief-help">A Figma, Drive or website link. Make sure our team can view it.</small>
              {errors.brief && <span className="error" id="brief-error">Enter a full link starting with https:// or http://.</span>}
            </div>
          )}
        </div>

        <div className="hp-field" aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <label htmlFor="company-website">Company website</label>
          <input id="company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
        </div>

        {captcha.enabled && <div className="captcha-field" ref={captchaRef} style={{ marginTop: '1rem' }} />}

        <div className="form-bottom">
          <p className="privacy">
            We’ll only use your details to discuss your project.{' '}
            <a href="/policy" target="_blank" rel="noopener noreferrer">Privacy policy ↗</a>
          </p>
          <div className="submit-group">
            <button type="submit" className="submit-circle ui-btn-icon-only" disabled={sending} aria-label={sending ? 'Sending' : 'Send inquiry'}>
              <img src={ArrowIcon} alt="" />
            </button>
            <Button type="submit" className="submit-button" disabled={sending}>{sending ? 'Sending…' : 'Let’s talk'}</Button>
          </div>
        </div>

        {status && (
          <div ref={statusRef} tabIndex={-1} role={status.state === 'error' ? 'alert' : 'status'} aria-live={status.state === 'error' ? 'assertive' : 'polite'} data-state={status.state}>
            {status.state === 'error' && status.inquiry ? (
              <>
                Your inquiry wasn’t sent. Your details are still here. Please try again, or{' '}
                <a
                  href={`mailto:info@strixproduction.com?subject=${encodeURIComponent(
                    'New project inquiry — ' + status.inquiry.name
                  )}&body=${encodeURIComponent(
                    [
                      `Name: ${status.inquiry.name}`,
                      `Email: ${status.inquiry.email}`,
                      `Services: ${status.inquiry.services.join(', ') || 'Let’s discuss'}`,
                      `Budget: ${status.inquiry.budget || 'Not decided'}`,
                      '',
                      status.inquiry.project,
                      '',
                      `Brief / reference: ${status.inquiry.brief || 'Not provided'}`
                    ].join('\n')
                  )}`}
                >
                  open your brief in email
                </a>.
              </>
            ) : (
              status.text
            )}
          </div>
        )}
      </form>
    </section>
  );
};

export default ContactForm;
