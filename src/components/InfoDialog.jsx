import { useEffect, useId, useRef } from "react";
import ReactDOM from "react-dom";
import { motion as Motion, AnimatePresence } from "motion/react";
import "../style/module.css";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/**
 * Native modal <dialog> shell for the Home service modals: Escape and the backdrop close it,
 * focus is trapped while open and returns to the opener, and the page scroll is locked with a
 * body class so other modals' locks are left alone.
 */
const InfoDialog = ({ isOpen, onClose, title, media, backdropStyle, contentStyle, closeClassName = "", closeIcon, children }) => {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog || dialog.open) return;
    returnFocusRef.current = document.activeElement;
    dialog.showModal();
    document.body.classList.add("info-dialog-open");
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) dialog.close();
      document.body.classList.remove("info-dialog-open");
    };
  }, []);

  const finishClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    document.body.classList.remove("info-dialog-open");
    const opener = returnFocusRef.current;
    returnFocusRef.current = null;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  };

  // Let Escape play the exit animation; the dialog closes once it finishes.
  const onCancel = (event) => {
    event.preventDefault();
    onClose();
  };

  // Escape can't always be cancelled (repeat presses); keep React state in sync when the browser closes it.
  const onNativeClose = () => {
    if (isOpen) onClose();
    else finishClose();
  };

  // A link inside navigated in-app (default prevented by the router): drop the dialog at once so
  // the page transition isn't hidden under the top layer.
  const onLinkClick = (event) => {
    if (!event.defaultPrevented || !event.target.closest("a[href]")) return;
    returnFocusRef.current = null;
    if (dialogRef.current?.open) dialogRef.current.close();
  };

  const dialog = (
    <dialog ref={dialogRef} className="info-dialog" aria-labelledby={titleId} onCancel={onCancel} onClose={onNativeClose} onClick={onLinkClick}>
      <AnimatePresence onExitComplete={finishClose}>
        {isOpen && (
          <Motion.div
            key="backdrop"
            className="backdrop"
            onClick={onClose}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={backdropStyle}
          />
        )}
        {isOpen && (
          <Motion.div
            key="content"
            className="modal-content2"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={contentStyle}
          >
            {media}
            <button type="button" className={["close-btnmode", closeClassName, "ui-btn-icon-only"].filter(Boolean).join(" ")} aria-label="Close" onClick={onClose}>
              <img src={closeIcon} alt="" width="30" height="40" />
            </button>
            <h1 id={titleId}>{title}</h1>
            {children}
          </Motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );

  return ReactDOM.createPortal(dialog, document.body);
};

export default InfoDialog;
