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
      <p className='btn-p'>{text}</p>
    </div>
  );
};

export default Button;
