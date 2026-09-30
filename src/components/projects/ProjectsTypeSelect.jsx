import { useEffect, useId, useRef, useState } from "react";

const ProjectsTypeSelect = ({ value, groups, allLabel, onChange }) => {
  const id = useId();
  const rootRef = useRef(null);
  const options = [
    { value: "", label: allLabel },
    ...groups.flatMap(({ label, types }) => types.map((type, index) => ({
      value: type,
      label: type,
      group: groups.length > 1 && index === 0 ? label : null,
    }))),
  ];
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, id]);

  const openMenu = () => { setActiveIndex(selectedIndex); setOpen(true); };
  const choose = (index) => { onChange(options[index].value); setOpen(false); };

  const onKeyDown = (event) => {
    const last = options.length - 1;
    const move = (index) => { event.preventDefault(); if (open) setActiveIndex(index); else openMenu(); };
    switch (event.key) {
      case "ArrowDown": move(Math.min(activeIndex + 1, last)); break;
      case "ArrowUp": move(Math.max(activeIndex - 1, 0)); break;
      case "Home": move(0); break;
      case "End": move(last); break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(activeIndex); else openMenu();
        break;
      case "Escape":
        if (open) { event.preventDefault(); setOpen(false); }
        break;
      case "Tab": setOpen(false); break;
      default:
    }
  };

  return (
    <div className="filter-select" ref={rootRef} data-open={open}>
      <span id={`${id}-label`}>Project type</span>
      <button
        type="button"
        className="filter-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        {options[selectedIndex].label}
      </button>
      {open && (
        <ul className="filter-select__menu" id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option, index) => (
            <li key={option.value || "all"} role="presentation" style={{ display: "contents" }}>
              {option.group && <div className="filter-select__group" aria-hidden="true">{option.group}</div>}
              <div
                id={`${id}-${index}`}
                role="option"
                className="filter-select__option"
                aria-selected={index === selectedIndex}
                data-active={index === activeIndex}
                onPointerMove={() => setActiveIndex(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                {option.label}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsTypeSelect;
