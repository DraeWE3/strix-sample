import { mvpCases } from "./mvpCases";
import BackdropImage from "../../assets/img/mvp/98796.png";
import WorkArrow from "../../assets/img/mvp/6499e.svg";

const works = [
  { id: "wurkzen", media: "wurkzen", alt: "Wurkzen AI sales platform graphic design", width: 537, height: 435 },
  { id: "arcova", media: "arcova", alt: "Arcova Solutions website displayed on a laptop", width: 537, height: 480 },
  { id: "ai-chatbot", media: "chatbot", alt: "AI chatbot mobile application with three purple interface screens", width: 587, height: 381 },
  { id: "ferrari", media: "ferrari", alt: "Ferrari racing car in a red 3D animated environment", width: 537, height: 381 },
];

const MvpMore = ({ onOpen }) => (
  <section className="mvp-more" id="more-mvps" aria-labelledby="more-mvps-heading">
    <h2 id="more-mvps-heading" data-reveal>More MVPs Delivered</h2>
    <p className="mvp-more-intro" data-reveal>Real products. Real timelines. Real results.</p>
    <div className="mvp-more-grid">
      {works.map(({ id, media, alt, width, height }) => (
        <article className="mvp-work-card" key={id} data-reveal>
          <button className="mvp-work-open" type="button" aria-haspopup="dialog" aria-label={`View ${mvpCases[id].title} project`} onClick={() => onOpen(id)}>
            <span className={`mvp-work-media mvp-work-media--${media}`}>
              <img className="mvp-work-backdrop" src={BackdropImage} alt="" loading="lazy" />
              <img className="mvp-work-image" src={mvpCases[id].image} alt={alt} width={width} height={height} loading="lazy" />
            </span>
            <span className="mvp-work-service">{mvpCases[id].service}</span>
            <span className="mvp-work-title"><span>{mvpCases[id].title}</span><span className="mvp-work-arrow" aria-hidden="true"><img src={WorkArrow} alt="" loading="lazy" /></span></span>
          </button>
        </article>
      ))}
    </div>
  </section>
);

export default MvpMore;
