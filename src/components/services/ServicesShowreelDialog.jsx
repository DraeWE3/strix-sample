import { useEffect, useRef } from "react";

// Placeholder showreel (Big Buck Bunny by Blender). Replace with Strix's YouTube video ID.
const SHOWREEL_VIDEO_ID = "aqz-KE-bpKQ";

const ServicesShowreelDialog = ({ trigger, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!trigger) return;
    dialog.showModal();
    document.body.classList.add("services-dialog-open");
    return () => {
      if (dialog.open) dialog.close();
      document.body.classList.remove("services-dialog-open");
      trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  const closeOnBackdrop = (event) => {
    const dialog = dialogRef.current;
    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (event.target === dialog && outside) dialog.close();
  };

  return (
    <dialog className="showreel-dialog" ref={dialogRef} aria-labelledby="showreel-title" onClose={onClose} onClick={closeOnBackdrop}>
      <div className="dialog-topline">
        <h2 id="showreel-title">Showreel</h2>
        <button className="dialog-close" type="button" aria-label="Close showreel" onClick={() => dialogRef.current.close()}>
          &times;
        </button>
      </div>
      <div className="video-mount">
        {trigger && (
          <iframe
            title="Placeholder showreel — Big Buck Bunny by Blender"
            src={`https://www.youtube-nocookie.com/embed/${SHOWREEL_VIDEO_ID}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      <p className="video-note">
        Placeholder video: Big Buck Bunny by Blender.{" "}
        <a href={`https://www.youtube.com/watch?v=${SHOWREEL_VIDEO_ID}`} target="_blank" rel="noopener noreferrer">
          Watch on YouTube &#8599;
        </a>
      </p>
    </dialog>
  );
};

export default ServicesShowreelDialog;
