import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import "./style/global.js";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/pageTransition";
import ScrollToTop from "./components/ScrollToTop";
import AdminRedirect from "./components/AdminRedirect";
import { canonicalPath } from "./lib/seo";
import { legacyRedirect } from "./data/legacyRoutes";

const Cs = lazy(() => import("./pages/Cs"));
const Project = lazy(() => import("./pages/Project"));
const CaseStudy = lazy(() => import("./pages/caseStudy"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Mvp = lazy(() => import("./pages/Mvp"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Policy = lazy(() => import("./pages/Policy"));
const Term = lazy(() => import("./pages/Term"));
const Ecommerce = lazy(() => import("./pages/devServices/ecommerce"));

/** One address per page: legacy paths, upper-case and trailing-slash variants redirect. */
const CanonicalRoutes = ({ children }) => {
  const { pathname, search, hash } = useLocation();
  if (/^\/admin(\/|$)/i.test(pathname)) return children;
  const canonical = canonicalPath(pathname);
  const target = legacyRedirect(canonical) ?? (canonical !== pathname ? canonical : null);
  if (target) return <Navigate to={`${target}${search}${hash}`} replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ScrollToTop />
        <PageTransition>
          <CanonicalRoutes>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cs" element={<Cs />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/works" element={<Project />} />
                <Route path="/case-study/:id" element={<CaseStudy />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/*" element={<AdminRedirect />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/mvp" element={<Mvp />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/term" element={<Term />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/ecommerce" element={<Ecommerce />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </CanonicalRoutes>
        </PageTransition>
      </MotionConfig>
    </BrowserRouter>
  );
};

export default App;
