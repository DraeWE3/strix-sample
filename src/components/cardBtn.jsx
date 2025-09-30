import React from "react";
import '../style/casrbtn.css'


const CardBtn = ({ text = "Log In", onClick }) => {
  return (
    <div
      tabIndex={0}
      role="button"
      className="card-btn"
      onClick={onClick}
    >
      <p className='btn-p'>{text}</p>
    </div>
  );
};

export default CardBtn;
