import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import "../style/notFound.css";
import { motion as Motion } from "motion/react";

const NotFound = () => {
    return (
        <div className="notfound-page">
            <SEO
                title="Page Not Found"
                description="The page you are looking for does not exist or has moved. Return to the Strix Production homepage to explore our design, development and production work."
                noindex
            />
            <Nav />
            <main className="notfound-content">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="notfound-glass"
                >
                    <h1 className="notfound-title">404</h1>
                    <div className="notfound-line"></div>
                    <p className="notfound-text">The page you're looking for has vanished into thin air.</p>
                    <Link to="/" className="notfound-btn">
                        Retrace Your Steps
                    </Link>
                </Motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
