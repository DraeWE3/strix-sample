import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── All service pages with their routes and categories ──
const SERVICES = [
    // Design Services
    { name: "UI/UX Design", route: "/uiux", category: "Design" },
    { name: "Product Design", route: "/product", category: "Design" },
    { name: "Branding", route: "/branding", category: "Design" },
    { name: "Web Design", route: "/webdesign", category: "Design" },
    { name: "App Design", route: "/appdesign", category: "Design" },
    { name: "Creative Design", route: "/cdesign", category: "Design" },

    // Dev Services
    { name: "Web App Development", route: "/webapp", category: "Development" },
    { name: "App Development", route: "/appdev", category: "Development" },
    { name: "Interactive Web", route: "/intaweb", category: "Development" },
    { name: "E-commerce", route: "/ecommerce", category: "Development" },
    { name: "Web Development", route: "/webdev", category: "Development" },
    { name: "Software Development", route: "/softwaredev", category: "Development" },

    // Production Services
    { name: "Commercials", route: "/commercials", category: "Production" },
    { name: "Long Form", route: "/longform", category: "Production" },
    { name: "Reels", route: "/reel", category: "Production" },
    { name: "Motion Graphics", route: "/motion", category: "Production" },
    { name: "3D & CGI", route: "/threed", category: "Production" },
];

const ServiceSearch = ({ variants, isMotion = true }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isListening, setIsListening] = useState(false);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    // ── Filter services based on query ──
    const filtered = query.trim()
        ? SERVICES.filter((s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.category.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    // ── Group filtered results by category ──
    const grouped = filtered.reduce((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {});

    // Flat list for keyboard navigation
    const flatResults = Object.values(grouped).flat();

    // ── Close dropdown on outside click ──
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Navigate to a service ──
    const goToService = useCallback(
        (route) => {
            setQuery("");
            setIsOpen(false);
            setActiveIndex(-1);
            navigate(route);
        },
        [navigate]
    );

    // ── Keyboard navigation ──
    const handleKeyDown = (e) => {
        if (!isOpen || flatResults.length === 0) {
            if (e.key === "Escape") setIsOpen(false);
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev < flatResults.length - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : flatResults.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < flatResults.length) {
                    goToService(flatResults[activeIndex].route);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setActiveIndex(-1);
                break;
            default:
                break;
        }
    };

    // ── Handle input change ──
    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setIsOpen(val.trim().length > 0);
        setActiveIndex(-1);
    };

    // ── Voice Search (Web Speech API) ──
    const startVoiceSearch = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice search is not supported in this browser.");
            return;
        }

        if (isListening) {
            // Stop listening
            recognitionRef.current?.abort();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsOpen(transcript.trim().length > 0);
            setActiveIndex(-1);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    // ── Dropdown animation variants ──
    const dropdownVariants = {
        hidden: { opacity: 0, y: -8, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } },
    };

    // ── Choose wrapper element ──
    const Wrapper = isMotion ? motion.div : "div";
    const wrapperProps = isMotion ? { variants, className: "service-search-wrapper" } : { className: "service-search-wrapper" };

    return (
        <Wrapper {...wrapperProps} ref={wrapperRef}>
            <div className="blur-box">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search services..."
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim() && setIsOpen(true)}
                />
            </div>
            <div
                className={`image-box${isListening ? " mic-listening" : ""}`}
                onClick={startVoiceSearch}
                title={isListening ? "Stop listening" : "Voice search"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && startVoiceSearch()}
            >
                <p></p>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="search-dropdown"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {flatResults.length > 0 ? (
                            Object.entries(grouped).map(([category, services]) => (
                                <div key={category} className="search-dropdown-group">
                                    <div className="search-dropdown-category">{category}</div>
                                    {services.map((service) => {
                                        const flatIdx = flatResults.indexOf(service);
                                        return (
                                            <div
                                                key={service.route}
                                                className={`search-dropdown-item${flatIdx === activeIndex ? " active" : ""
                                                    }`}
                                                onClick={() => goToService(service.route)}
                                                onMouseEnter={() => setActiveIndex(flatIdx)}
                                            >
                                                <span className="search-item-name">{service.name}</span>
                                                <span className="search-item-arrow">→</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        ) : (
                            <div className="search-dropdown-empty">No services found</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </Wrapper>
    );
};

export default ServiceSearch;
