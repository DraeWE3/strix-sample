import React from "react";
import { Link } from 'react-router-dom';
import '../style/normsmallbtn.css'


const BtnNormsall = ({ text = "Log In", onClick, to }) => {
  const button = (
    <div
      tabIndex={0}
      role="button"
      className="btn-norm"
      onClick={onClick}
    >
      <div className="space-btn"><p className='btn-p'>{text}</p></div>
    </div>
  );

  if (to) {
    return <Link to={to}>{button}</Link>;
  }

  return button;
};

export default BtnNormsall;
