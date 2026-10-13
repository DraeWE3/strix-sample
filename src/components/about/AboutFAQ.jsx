import FAQ from "../FAQ";

const FAQS = [
  {
    question: "What does Strix Production do?",
    answer: "Strix Production is a design, development and production studio. We create digital products, websites, brand identities and visual content for startups, SaaS businesses and technology teams.",
  },
  {
    question: "Can you handle both design and development?",
    answer: "Yes. Our work spans product and UX/UI design, web and mobile development, and launch content. We can support a focused brief or connect those disciplines across one project.",
  },
  {
    question: "Where is your team based?",
    answer: "We are based in New Delhi, India, and collaborate remotely with clients around the world. Working hours and communication are agreed at the start of the project.",
  },
  {
    question: "How long will my project take?",
    answer: "Timing depends on the scope and complexity. We use discovery to understand the brief, then agree on deliverables, milestones and a realistic schedule in the proposal.",
  },
  {
    question: "How do we get started?",
    answer: "Book a free 20-minute discovery call. We will discuss your product, goals and timeline, then decide whether Strix is the right fit and outline the next steps.",
  },
];

const AboutFAQ = () => <FAQ faqData={FAQS} />;

export default AboutFAQ;
