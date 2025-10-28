import React from 'react'
import { Link } from 'react-router-dom'
import '../style/home.css'

const Url = () => {
  return (
    <div className='url-con'>
      <Link to='/service'>Services</Link>
      <Link to="/about">About</Link>
      <Link to="/Project">Project</Link>
      <Link to="/caseStudy">CaseStudy</Link>
      <Link to="/uiux">Uiux</Link>
    </div>
  )
}

export default Url
