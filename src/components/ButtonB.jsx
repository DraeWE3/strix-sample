import React from "react";
import '../style/button.css'


const Buttonb = ({text = "Log In", onClick, disabled = false }) => {
   const buttonStyles = {
    backgroundColor: '#000000ff',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '400',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    minWidth: '180px',
    height: '60px',
    boxShadow: `
      0 8px 24px rgba(0, 0, 0, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 20px 40px -10px rgba(255, 255, 255, 0.05)
    `,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    letterSpacing: '0.3px',
    position: 'relative',
    overflow: 'hidden',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)'
  };

  const hoverStyles = {
    backgroundColor: '#2a2a2a',
    transform: 'translateY(-1px)',
    boxShadow: `
      0 12px 32px rgba(0, 0, 0, 0.45),
      0 4px 12px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.08),
      0 25px 50px -12px rgba(255, 255, 255, 0.08)
    `,
    textShadow: '0 0 15px rgba(255, 255, 255, 0.4), 0 0 25px rgba(255, 255, 255, 0.15)'
  };

  const activeStyles = {
    transform: 'translateY(0px)',
    boxShadow: `
      0 4px 16px rgba(0, 0, 0, 0.4),
      0 1px 4px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.03),
      0 15px 30px -8px rgba(255, 255, 255, 0.03)
    `,
    textShadow: '0 0 8px rgba(255, 255, 255, 0.25), 0 0 15px rgba(255, 255, 255, 0.08)'
  };

  const disabledStyles = {
    backgroundColor: '#666666',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    textShadow: 'none'
  };

  const arrowStyles = {
    fontSize: '20px',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease'
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const getFinalStyles = () => {
    let finalStyles = { ...buttonStyles };
    
    if (disabled) {
      finalStyles = { ...finalStyles, ...disabledStyles };
    } else if (isActive) {
      finalStyles = { ...finalStyles, ...activeStyles };
    } else if (isHovered) {
      finalStyles = { ...finalStyles, ...hoverStyles };
    }
    
    return finalStyles;
  };

  const getArrowStyles = () => {
    return {
      ...arrowStyles,
      transform: isHovered && !disabled ? 'translate(2px, -2px)' : 'translate(0, 0)'
    };
  };

  return (
    <button 
      style={getFinalStyles()}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      <span>{text}</span>
      <span style={getArrowStyles()}>↗</span>
    </button>
  );
};

export default Buttonb;