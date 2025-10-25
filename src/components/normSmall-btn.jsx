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
      <div className="space-btn"><p className='btn-p'>{text}</p></div>
    </div>
  );
};

export default BtnNormsall;
