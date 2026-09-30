import { useEffect, useRef } from "react";
import { BOOKING_URL } from "./mvpCases";

const MvpCaseDialog = ({ project, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    document.documentElement.classList.add("has-case-dialog");
    return () => document.documentElement.classList.remove("has-case-dialog");
  }, []);

  const closeOnBackdrop = (event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  };

  return (
    <dialog ref={dialogRef} className="mvp-case-dialog" aria-labelledby="case-preview-title" onClose={onClose} onClick={closeOnBackdrop}>
      <button className="mvp-case-dialog__close" type="button" aria-label="Close project preview" onClick={() => dialogRef.current.close()}>×</button>
      <img className="mvp-case-dialog__image" src={project.image} alt={`${project.title} project artwork`} />
      <div className="mvp-case-dialog__body">
        <p className="mvp-case-dialog__eyebrow">{project.service}</p>
        <h2 className="mvp-case-dialog__title" id="case-preview-title">{project.title}</h2>
        {project.description && <p className="mvp-case-dialog__description">{project.description}</p>}
        {project.facts && (
          <dl className="mvp-case-dialog__facts">
            {project.facts.map(([value, label]) => (
              <div key={value}><dt>{value}</dt><dd>{label}</dd></div>
            ))}
          </dl>
        )}
        <a className="mvp-case-dialog__cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Let’s discuss your MVP ↗</a>
      </div>
    </dialog>
  );
};

export default MvpCaseDialog;
