const icons = import.meta.glob('../../assets/img/blog/figma/*.svg', { eager: true, import: 'default' });
const icon = (hash) => icons[`../../assets/img/blog/figma/${hash}.svg`];

const GOOGLE_DOTS = [
  ['17.55%', '28.13%', '-9.86px -6.154px', '98572'],
  ['36.1%', '28.13%', '-9.86px -12.654px', '4e2b1'],
  ['54.64%', '28.13%', '-9.86px -19.154px', '86f2d'],
  ['73.18%', '28.13%', '-9.86px -25.655px', 'a0032'],
  ['7.54%', '43.34%', '-15.192px -2.644px', '1839b'],
  ['26.08%', '43.34%', '-15.192px -9.144px', '86e60'],
  ['44.62%', '43.34%', '-15.192px -15.645px', 'cda52'],
  ['63.16%', '43.34%', '-15.192px -22.144px', '79a88'],
  ['82.08%', '43.34%', '-15.192px -28.775px', 'ec201'],
  ['16.07%', '58.16%', '-20.388px -5.634px', 'ff38f'],
  ['34.61%', '58.16%', '-20.388px -12.134px', '644d8'],
  ['53.15%', '58.16%', '-20.388px -18.634px', '8e99d'],
  ['71.69%', '58.16%', '-20.388px -25.135px', '8e99d'],
  ['24.23%', '73%', '-25.592px -8.494px', '60da3'],
  ['27.57%', '12.92%', '-4.527px -9.664px', '29f4b'],
  ['46.11%', '12.92%', '-4.527px -16.165px', '410b2'],
  ['64.65%', '12.92%', '-4.527px -22.664px', 'be153'],
  ['42.77%', '73%', '-25.592px -14.995px', '46d69'],
  ['61.31%', '73%', '-25.592px -21.495px', '63790'],
];

const PROVIDERS = [
  { key: 'chatgpt', name: 'Open AI', label: 'ChatGPT', url: 'https://chatgpt.com/?q=' },
  { key: 'perplexity', name: 'Perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
  { key: 'google', name: 'Google Search AI', label: 'Google', url: 'https://www.google.com/search?udm=50&q=' },
];

const ProviderIcon = ({ provider }) => {
  if (provider === 'chatgpt') {
    return <span className="case-summary__icon" aria-hidden="true"><span className="case-summary__openai"><img src={icon('338be')} alt="" /></span></span>;
  }
  if (provider === 'perplexity') {
    return <span className="case-summary__icon" aria-hidden="true"><span className="case-summary__perplexity"><img src={icon('8a2bf')} alt="" /></span></span>;
  }
  return (
    <span className="case-summary__icon case-summary__google" aria-hidden="true">
      {GOOGLE_DOTS.map(([top, left, maskPosition, hash], index) => (
        <span key={index} style={{ top, left, maskPosition, WebkitMaskPosition: maskPosition }}><img src={icon(hash)} alt="" /></span>
      ))}
    </span>
  );
};

const BlogSummaryLinks = ({ prompt, subject = 'article' }) => (
  <div className="case-summary">
    <span className="case-summary__label">Summaries with</span>
    <div className="case-summary__links">
      {PROVIDERS.map(({ key, name, label, url }) => (
        <a
          key={key}
          className="case-summary__link"
          href={url + encodeURIComponent(prompt)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Summarize this ${subject} with ${label}`}
        >
          <ProviderIcon provider={key} />
          <span className="case-summary__tooltip">{name}</span>
        </a>
      ))}
    </div>
  </div>
);

export default BlogSummaryLinks;
