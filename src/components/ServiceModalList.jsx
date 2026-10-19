import { Link } from "react-router-dom";

/** Two-column list of a gallery's services; `icons` maps a card's href to its modal icon. */
const ServiceModalList = ({ gallery, icons }) => {
  const half = Math.ceil(gallery.cards.length / 2);
  const columns = [gallery.cards.slice(0, half), gallery.cards.slice(half)];
  return (
    <div className="mcp-con">
      {columns.map((cards, index) => (
        <div className="mcp-left" key={index}>
          {cards.map((card) => (
            <Link to={card.href} key={card.href}>
              <div className="table">
                <img src={icons[card.href]} alt="" className="t-icon" width="48" height="48" />
                <div className="t-txt">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ServiceModalList;
