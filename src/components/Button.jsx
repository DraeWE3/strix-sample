import React from "react";
import '../style/button.css'


const Button = ({ text = "Log In", onClick }) => {
  return (
    <div
      aria-label="User Login Button"
      tabIndex={0}
      role="button"
      className="btn"
      onClick={onClick}
    >
      <div className="space-btn"><p className='bbtn-p'>{text}</p></div>
    </div>
  );
};

export default Button;
