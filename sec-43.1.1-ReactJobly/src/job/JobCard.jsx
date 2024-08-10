import React from 'react'
import {Link} from 'react-router-dom';
import './JobCard.css'

export default function JobCard({job}) {
  const {id, title, salary, equity, companyHandle} = job;

  return (
    <li className="JobCard">
      <h3>{title}</h3>
      <p>Salary: <span className="detail-value">{salary}</span></p>
      <p>Equity: <span className="detail-value">{equity}</span></p>
    </li>
  )
}
