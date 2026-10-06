// Client wordmarks shown at the top of proof cards in place of a text label. They are drawn
// inline (not as <img>) so they can use the site's loaded fonts and scale with the card.
const MinAndMaria = () => (
  <svg className="client-logo client-logo--min-maria" viewBox="0 0 150 56" role="img" aria-label="Min & Maria">
    <text x="0" y="22" fill="#39c9bc" fontFamily="Syne, syne-med, sans-serif" fontWeight="500" fontSize="22" letterSpacing="2.6">MIN</text>
    <text x="58" y="24" fill="#39c9bc" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize="28">&amp;</text>
    <text x="0" y="50" fill="#39c9bc" fontFamily="Syne, syne-med, sans-serif" fontWeight="500" fontSize="22" letterSpacing="2.6">MARIA</text>
  </svg>
);

const ImpactRiver = () => (
  <svg className="client-logo client-logo--impact-river" viewBox="0 0 230 56" role="img" aria-label="Impact River">
    <text x="115" y="32" textAnchor="middle" fill="#fff" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="27" letterSpacing="1.4">
      <tspan fontSize="34">I</tspan>MPACT <tspan fontSize="34">R</tspan>IVER
    </text>
    <path d="M28 46 Q115 54 202 46" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </svg>
);

const Arhiwar = () => (
  <svg className="client-logo client-logo--arhiwar" viewBox="0 0 130 64" role="img" aria-label="Arhiwar">
    <defs>
      <linearGradient id="arhiwar-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8a2cff" />
        <stop offset=".55" stopColor="#c43cff" />
        <stop offset="1" stopColor="#ff3cc8" />
      </linearGradient>
    </defs>
    <g transform="skewX(-16)">
      <text x="30" y="40" fill="url(#arhiwar-grad)" fontFamily="Syne, syne-extrabold, sans-serif" fontWeight="800" fontSize="46" letterSpacing="-2">AW</text>
      <rect x="22" y="46" width="98" height="2.4" fill="url(#arhiwar-grad)" />
    </g>
    <text x="65" y="60" textAnchor="middle" fill="#cfcfcf" fontFamily="Syne, syne-med, sans-serif" fontWeight="500" fontSize="8.5" letterSpacing="2.8">ARHIWAR</text>
  </svg>
);

const LOGOS = { "min-maria": MinAndMaria, "impact-river": ImpactRiver, arhiwar: Arhiwar };

const ClientLogo = ({ name }) => {
  const Logo = LOGOS[name];
  return Logo ? <Logo /> : null;
};

export default ClientLogo;
