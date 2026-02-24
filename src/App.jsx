import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cs from "./pages/Cs";
import Project from "./pages/Project";
import PageTransition from "./components/pageTransition";
import ScrollToTop from "./components/ScrollToTop"; // ✅ Import this
import CaseStudy from "./pages/caseStudy";
import Service from "./pages/service";
import Uiux from "./pages/designServices/uiux";
import Product from "./pages/designServices/product";
import Branding from "./pages/designServices/Branding";
import WebDesign from "./pages/designServices/webdesign";
import AppDesign from "./pages/designServices/AppDesign";
import CreativeDesign from "./pages/designServices/cDesign";
import About from "./pages/About";
import Contact from './pages/contact'
import Url from "./components/route";
import AdminPanel from "./admin/admin";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Mvp from "./pages/Mvp";
import Cookies from "./pages/Cookies";
import Policy from "./pages/Policy";
import Term from "./pages/Term";
import WebApp from "./pages/devServices/webApps"
import AppDev from "./pages/devServices/appDev"
import InteractiveWeb from "./pages/devServices/intaweb"
import Ecommerce from "./pages/devServices/ecommerce"
import WebDev from "./pages/devServices/webdev"
import SoftwareDev from "./pages/devServices/softwaredev"
import Commercials from "./pages/productionServices/commercials"
import LongForm from "./pages/productionServices/longform"
import Reel from "./pages/productionServices/reel"
import Motion from "./pages/productionServices/motion"
import ThreeD from "./pages/productionServices/threeD"


const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* ✅ Add this BEFORE PageTransition */}
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cs" element={<Cs />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/Project" element={<Project />} />
          <Route path="/case-study/:id" element={<CaseStudy />} />
          <Route path="/service" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Url" element={<Url />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/mvp" element={<Mvp />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/term" element={<Term />} />
          <Route path="/policy" element={<Policy />} />

          <Route path="/product" element={<Product />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/webdesign" element={<WebDesign />} />
          <Route path="/appdesign" element={<AppDesign />} />
          <Route path="/cdesign" element={<CreativeDesign />} />
          <Route path="/uiux" element={<Uiux />} />

          <Route path="/webapp" element={<WebApp />} />
          <Route path="/appdev" element={<AppDev />} />
          <Route path="/intaweb" element={<InteractiveWeb />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/webdev" element={<WebDev />} />
          <Route path="/softwaredev" element={<SoftwareDev />} />

          <Route path="/commercials" element={<Commercials />} />
          <Route path="/longform" element={<LongForm />} />
          <Route path="/reel" element={<Reel />} />
          <Route path="/motion" element={<Motion />} />
          <Route path="/threed" element={<ThreeD />} />


        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
};

export default App;