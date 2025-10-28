import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Cs from "./pages/Cs";
import Project from "./pages/Project";
import PageTransition from "./components/pageTransition";
import ScrollToTop from "./components/ScrollToTop"; // ✅ Import this
import CaseStudy from "./pages/caseStudy";
import Service from "./pages/service";
import Uiux from "./pages/uiux";
import About from "./pages/About";
import Contact from './pages/contact'
import Url from "./components/route";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* ✅ Add this BEFORE PageTransition */}
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cs" element={<Cs />} />
          <Route path="/Project" element={<Project />} />
          <Route path="/caseStudy" element={<CaseStudy />} />
          <Route path="/service" element={<Service />} />
          <Route path="/uiux" element={<Uiux />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Url" element={<Url />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
};

export default App;