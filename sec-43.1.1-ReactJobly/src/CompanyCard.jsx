import React from 'react'
import {Link} from 'react-router-dom';
import './CompanyCard.css'

export default function CompanyCard({handle, name, description, logoURL}) {
  return (
    <li className="CompanyCard">
      <Link to={handle} className="link">
        <div>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <img src={logoURL} />
      </Link>
    </li>
  )
}
