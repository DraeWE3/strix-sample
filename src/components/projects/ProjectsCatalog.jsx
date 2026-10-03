import Button from "../Button";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOptimizedImage } from "../../lib/cloudinary";
import ProjectsTypeSelect from "./ProjectsTypeSelect";
import {
  CATEGORIES,
  FILTERS,
  PAGE_SIZE,
  filterProjects,
  normalizeState,
  searchFromState,
  stateFromSearch,
} from "./projectFilters";
import CardArrow from "../../assets/img/projects/6499e.svg";

const CATEGORY_LABELS = { All: "All work" };

const ProjectCard = ({ project, index }) => (
  <article className="project-card" style={{ "--card-index": index % PAGE_SIZE }}>
    <Link className="project-card__open" to={project.link || `/case-study/${project.id}`}>
      <div className="project-card__media">
        <img
          className="project-card__image"
          src={getOptimizedImage(project.image)}
          alt={project.title}
          width="1074"
          height="762"
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="project-card__services">{project.categoryText}</p>
      <div className="project-card__heading">
        <h3 className="project-card__title">{project.title}</h3>
        <img className="project-card__arrow" src={CardArrow} alt="" width="20" height="20" aria-hidden="true" />
      </div>
    </Link>
  </article>
);

const ProjectsCatalog = ({ projects, loading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useMemo(() => stateFromSearch(searchParams), [searchParams]);
  const filtered = useMemo(() => filterProjects(projects, state), [projects, state]);
  const visible = filtered.slice(0, state.limit);
  const remaining = filtered.length - visible.length;
  const typeGroups = (FILTERS[state.category] ? [state.category] : Object.keys(FILTERS))
    .map((category) => ({ label: category, types: FILTERS[category] }));
  const active = state.category !== "All" || Boolean(state.type);

  const update = (next) => setSearchParams(searchFromState(normalizeState({ ...state, ...next })));
  const setFilter = (next) => update({ ...next, limit: PAGE_SIZE });
  const clearFilters = () => setSearchParams({});

  let count = "";
  if (!loading) {
    count = filtered.length
      ? `Showing ${visible.length} of ${filtered.length} project${filtered.length === 1 ? "" : "s"}`
      : "No projects match these filters";
  }

  return (
    <section className="catalog" id="projects-catalog" aria-labelledby="catalog-title">
      <div className="catalog-controls">
        <div className="category-tabs" role="group" aria-label="Filter by service category">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={state.category === category}
              onClick={() => setFilter({ category, type: "" })}
            >
              {CATEGORY_LABELS[category] || category}
            </button>
          ))}
        </div>
        <div className="filter-selects">
          <ProjectsTypeSelect
            value={state.type}
            allLabel="All project types"
            groups={typeGroups}
            onChange={(type) => setFilter({ type })}
          />
        </div>
      </div>
      <h2 id="catalog-title">Work that doesn’t just look good – it drives real results</h2>
      <div className="catalog-meta">
        <p role="status" aria-live="polite" aria-atomic="true">{count}</p>
        {active && <button type="button" onClick={clearFilters}>Clear filters <span aria-hidden="true">×</span></button>}
      </div>
      {loading && <div className="project-empty"><p>Loading projects...</p></div>}
      {!loading && filtered.length > 0 && (
        <div className="project-grid">
          {visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="project-empty">
          <p className="project-empty__eyebrow">A fresh possibility</p>
          <h3>No projects match these filters.</h3>
          <p>Explore another combination, or tell us what you’re planning.</p>
          <div>
            {active && <button type="button" onClick={clearFilters}>Show all projects</button>}
            <Link to="/contact">Discuss your project ↗</Link>
          </div>
        </div>
      )}
      <div className="catalog-bottom">
        <p>Projects tailored to your industry or need are available on request.</p>
        {remaining > 0 && (
          <Button className="load-more"
            aria-label={`Load ${Math.min(PAGE_SIZE, remaining)} more projects`}
            onClick={() => update({ limit: state.limit + PAGE_SIZE })}
          >Load More</Button>
        )}
      </div>
    </section>
  );
};

export default ProjectsCatalog;
