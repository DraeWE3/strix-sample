import React from 'react'
import '../style/buttonI.css'

export const ButtonI = ({text = "Log In", onClick, disabled = false }) => {
  return (
<button className="buttonI">
    <span className='I-txt'>{text}</span>
    <span style={{marginLeft: '5px'}}>↗</span>
</button>

  )
}
