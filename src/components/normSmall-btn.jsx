import React from "react";
import '../style/normsmallbtn.css'


const BtnNormsall = ({ text = "Log In", onClick }) => {
  return (
    <div
      tabIndex={0}
      role="button"
      className="btn-norm"
      onClick={onClick}
    >
      <p className='btn-p'>{text}</p>
    </div>
  );
};

export default BtnNormsall;
