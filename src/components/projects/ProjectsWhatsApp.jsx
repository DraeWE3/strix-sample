import { useEffect, useState } from "react";
import WhatsAppIcon from "../../assets/img/projects/4c273.svg";

const ProjectsWhatsApp = () => {
  const [footerVisible, setFooterVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".footer");
    if (!footer || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => setFooterVisible(entries.some((entry) => entry.isIntersecting)));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      className="floating-whatsapp"
      href="https://wa.me/919958844094"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuss your project on WhatsApp"
      hidden={footerVisible && !focused}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <img src={WhatsAppIcon} alt="" />
    </a>
  );
};

export default ProjectsWhatsApp;
