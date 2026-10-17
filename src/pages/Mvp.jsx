import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../style/fonts.css";
import "../style/mvp.css";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { pageMeta } from "../data/pageMeta";
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
import ReturnArrow from "../assets/img/mvp/a9103.svg";
import FaqClosedIcon from "../assets/img/mvp/8c8df.svg";

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
        {...pageMeta['/mvp']}
        schema={faqSchema}
      />
      <Nav />
      <div className="mvp-page-shell" ref={shellRef}>
        <MvpBackdrops />
        <Link className="mvp-return" to="/">
          <img src={ReturnArrow} alt="" aria-hidden="true" width="13.13" height="8.25" />
          <span>Return to Homepage</span>
        </Link>
        <MvpHero />
        <MvpSuccess projects={projects.slice(0, SUCCESS_COUNT)} loading={loading} error={error} onOpen={setActiveCase} />
        <MvpBenefits />
        <MvpProcess />
        <MvpMore projects={projects.slice(SUCCESS_COUNT, SUCCESS_COUNT + MORE_COUNT)} loading={loading} error={error} />
        <MvpConnect />
        <FAQ faqData={mvpFaqs} closedIcon={FaqClosedIcon} />
        {activeCase && <MvpCaseDialog project={activeCase} onClose={() => setActiveCase(null)} />}
      </div>
      <Footer />
    </div>
  );
};

export default Mvp;
