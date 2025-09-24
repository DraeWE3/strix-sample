import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  className = "",
  separator = "",
  onStart,
  onEnd,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Reset text to start number
    ref.current.textContent = from;

    let ctx = gsap.context(() => {
      let obj = { val: from };

      gsap.to(obj, {
        val: to,
        duration,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true, // run once
          onEnter: () => {
            if (typeof onStart === "function") onStart();
          },
        },
        onUpdate: () => {
          if (ref.current) {
            // round value to integer
            const currentVal = Math.floor(obj.val);

            const formattedNumber = separator
              ? currentVal.toLocaleString("en-US").replace(/,/g, separator)
              : currentVal.toLocaleString("en-US");

            // Update number text
            ref.current.textContent = formattedNumber;

            // Fade-in animation on every update
            gsap.fromTo(
              ref.current,
              { opacity: 1, y: 5 },
              { opacity: 1, y: 0, duration: 0.2, overwrite: "auto" }
            );
          }
        },
        onComplete: () => {
          if (typeof onEnd === "function") onEnd();
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [from, to, duration, separator, onStart, onEnd]);

  return <span className={className} ref={ref} />;
}
