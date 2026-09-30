import KundliPreview from "../../assets/img/home/ffd8f.png";
import RyvonPreview from "../../assets/img/home/7d95c.png";
import WurkzenImage from "../../assets/img/mvp/16430.png";
import ArcovaImage from "../../assets/img/mvp/355de.png";
import ChatbotImage from "../../assets/img/mvp/6bcfb.png";
import FerrariImage from "../../assets/img/mvp/0704a.png";

export const BOOKING_URL = "https://calendly.com/strix-ryvon/raj-consultation";

export const mvpCases = {
  kundli: {
    title: "The Kundli Pro",
    service: "Mobile MVP",
    image: KundliPreview,
    description: "The Kundli Pro is a Vedic astrology software used to create detailed birth charts, predict future events, and analyze horoscopes.",
    facts: [["50,000+", "Downloads on Google Play Store"], ["⭐ 4.0", "Average user rating with 100+ reviews"]],
  },
  ryvon: {
    title: "Ryvon AI",
    service: "AI SaaS Platform",
    image: RyvonPreview,
    description: "Ryvon is one platform for document chat, audio transcription, and workflow automation.",
    facts: [["<3 Weeks", "From idea to launch ready"], ["$1M+", "Pre-seed valuation"]],
  },
  wurkzen: { title: "Wurkzen", service: "Graphics Design", image: WurkzenImage },
  arcova: { title: "Arcova", service: "Branding, UI/UX, Website", image: ArcovaImage },
  "ai-chatbot": { title: "AI Chatbot Application", service: "UI/UX, Mobile App Design", image: ChatbotImage },
  ferrari: { title: "Ferrari", service: "3D Animation, UI/UX", image: FerrariImage },
};
