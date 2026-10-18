import { useEffect, useRef } from "react";
import "../style/showreel-dialog.css";
import "../style/button.css";
import { SHOWREEL_ID } from "./showreel";

const ShowreelDialog = ({ trigger, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!trigger) return;
    dialog.showModal();
    document.body.classList.add("showreel-dialog-open");
    return () => {
      if (dialog.open) dialog.close();
      document.body.classList.remove("showreel-dialog-open");
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
        <button className="dialog-close ui-btn-icon-only" type="button" aria-label="Close showreel" onClick={() => dialogRef.current.close()}>
          &times;
        </button>
      </div>
      <div className="video-mount">
        {trigger && (
          <iframe
            title="Strix Production showreel"
            src={`https://www.youtube-nocookie.com/embed/${SHOWREEL_ID}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      <p className="video-note">
        <a href={`https://www.youtube.com/watch?v=${SHOWREEL_ID}`} target="_blank" rel="noopener noreferrer">
          Watch on YouTube &#8599;
        </a>
      </p>
    </dialog>
  );
};

export default ShowreelDialog;
