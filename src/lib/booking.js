// Calendly link behind every "Book a call" / "Book Appointment" button. Set VITE_CALENDLY_URL in
// .env to change it everywhere; the fallback keeps builds without it working.
export const BOOKING_URL = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/strix-ryvon/raj-consultation";
