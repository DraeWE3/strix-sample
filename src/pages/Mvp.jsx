import { useRef, useState } from "react";
import "../style/fonts.css";
import "../style/mvp.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import useScrollReveal from "../animations/useScrollReveal";
import { useProjects } from "../lib/projects";
import MvpBackdrops from "../components/mvp/MvpBackdrops";
import MvpHero from "../components/mvp/MvpHero";
import MvpSuccess from "../components/mvp/MvpSuccess";
import MvpBenefits from "../components/mvp/MvpBenefits";
import MvpProcess from "../components/mvp/MvpProcess";
import MvpMore from "../components/mvp/MvpMore";
import MvpConnect from "../components/mvp/MvpConnect";
import FAQ from "../components/FAQ";
import MvpCaseDialog from "../components/mvp/MvpCaseDialog";
import { mvpFaqs } from "../components/mvp/mvpFaqs";

const SUCCESS_COUNT = 2;
const MORE_COUNT = 4;

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
  const { projects, loading, error } = useProjects();
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
        <MvpSuccess projects={projects.slice(0, SUCCESS_COUNT)} loading={loading} error={error} onOpen={setActiveCase} />
        <MvpBenefits />
        <MvpProcess />
        <MvpMore projects={projects.slice(SUCCESS_COUNT, SUCCESS_COUNT + MORE_COUNT)} loading={loading} error={error} />
        <MvpConnect />
        <FAQ faqData={mvpFaqs} />
        {activeCase && <MvpCaseDialog project={activeCase} onClose={() => setActiveCase(null)} />}
      </div>
      <Footer />
    </div>
  );
};

export default Mvp;
