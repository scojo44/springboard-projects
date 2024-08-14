import React, {useContext} from 'react'
import UserContext from '../UserContext'
import './JobCard.css'

export default function JobCard({job}) {
  const {appliedJobIDs, applyToJob} = useContext(UserContext);
  const {id, title, salary, equity, companyHandle} = job;

  return (
    <li className="JobCard">
      <div>
        <h3>{title}</h3>
        <p>Salary: <span className="detail-value">{salary}</span></p>
        <p>Equity: <span className="detail-value">{equity}</span></p>
      </div>
      <div>
        <button type="button" onClick={() => applyToJob(id)} disabled={appliedJobIDs.has(id)}>
          {appliedJobIDs.has(id)? 'Applied':'Apply'}
        </button>
      </div>
    </li>
  );
}
