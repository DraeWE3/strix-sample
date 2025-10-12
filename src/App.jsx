import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Cs from "./pages/Cs";
import Project from "./pages/Project";
import PageTransition from "./components/pageTransition";
import CaseStudy from "./pages/caseStudy";
import Service from "./pages/service";
import Uiux from "./pages/uiux";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop"; // <-- import it

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* <-- add this line */}
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cs" element={<Cs />} />
          <Route path="/Project" element={<Project />} />
          <Route path="/caseStudy" element={<CaseStudy />} />
          <Route path="/service" element={<Service />} />
          <Route path="/uiux" element={<Uiux />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
};

export default App;
