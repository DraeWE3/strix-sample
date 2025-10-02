import React from "react";
import '../style/btn-small.css'


const ButtonSmall = ({ text = "Log In", onClick }) => {
  return (
    <div
      aria-label="User Login Button"
      tabIndex={0}
      role="button"
      className="btn-small"
      onClick={onClick}
    >
      <p className='btn-small-p'>{text}</p> <span className="small-btn-arrow"></span>
    </div>
  );
};

export default ButtonSmall;
