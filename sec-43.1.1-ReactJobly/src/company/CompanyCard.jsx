import React from 'react'
import {Link} from 'react-router-dom';
import './CompanyCard.css'

export default function CompanyCard({company}) {
  const {handle, name, description, logoURL} = company;

  return (
    <li className="CompanyCard">
      <Link to={handle} className="link">
        <div>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <img src={logoURL} alt={name + ' Logo'} />
      </Link>
    </li>
  );
}
