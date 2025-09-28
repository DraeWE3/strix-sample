import React from "react";
import '../style/buttonI.css'


const ButtonArrow = ({ text = "Log In", onClick }) => {
  return (
    <div
      aria-label="User Login Button"
      tabIndex={0}
      role="button"
      className="btn-arr"
      onClick={onClick}
    >
      <p className='btn-p'>{text}</p> <span className="btn-arrow"></span>
    </div>
  );
};

export default ButtonArrow;
