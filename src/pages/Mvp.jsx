import { useRef, useState } from "react";
import "../style/fonts.css";
import "../style/mvp.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import useScrollReveal from "../animations/useScrollReveal";
import MvpBackdrops from "../components/mvp/MvpBackdrops";
import MvpHero from "../components/mvp/MvpHero";
import MvpSuccess from "../components/mvp/MvpSuccess";
import MvpBenefits from "../components/mvp/MvpBenefits";
import MvpProcess from "../components/mvp/MvpProcess";
import MvpMore from "../components/mvp/MvpMore";
import MvpConnect from "../components/mvp/MvpConnect";
import MvpFAQ from "../components/mvp/MvpFAQ";
import MvpCaseDialog from "../components/mvp/MvpCaseDialog";
import { mvpFaqs } from "../components/mvp/mvpFaqs";
import { mvpCases } from "../components/mvp/mvpCases";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: mvpFaqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const Mvp = () => {
  const shellRef = useRef(null);
  const [activeCase, setActiveCase] = useState(null);
  useScrollReveal(shellRef, { readyClass: "mvp-motion-ready" });

  return (
    <div>
      <SEO
        title="Full-Stack MVP Development Company | Custom MVP Development Services"
        description="Full-stack MVP development company providing custom MVP development services to turn your ideas into scalable, market-ready products fast and efficiently."
        schema={faqSchema}
      />
      <Nav />
      <div className="mvp-page-shell" ref={shellRef}>
        <MvpBackdrops />
        <MvpHero />
        <MvpSuccess onOpen={setActiveCase} />
        <MvpBenefits />
        <MvpProcess />
        <MvpMore onOpen={setActiveCase} />
        <MvpConnect />
        <MvpFAQ />
        {activeCase && <MvpCaseDialog project={mvpCases[activeCase]} onClose={() => setActiveCase(null)} />}
      </div>
      <Footer />
    </div>
  );
};

export default Mvp;
