import React from 'react'
import {useParams} from 'react-router-dom'
import JoblyApi from './api'
import useJoblyAPI from './hooks/useJoblyAPI'
import LoadingIndicator from './LoadingIndicator'
import Alert from './Alert'
import './CompanyDetail.css'

export default function CompanyDetail() {
  const {data: company, error, isLoading} = useJoblyAPI(JoblyApi.getCompany, useParams().handle);
  const {name, description, numEmployees, logoURL, jobs} = company;

  if(isLoading) return <LoadingIndicator />;

  return (
    <section className="CompanyDetail">
      <div className="info">
        <h3>{name}</h3>
        <img src={logoURL} />
        <p>{description}</p>
        <p>Employees: <span className="detail-value">{numEmployees}</span></p>
      </div>
      {error
        ? <div><Alert type="error" messages={[`Error loading companies: ${error}`]} /></div>
        : <ul className="jobs">
          </ul>
      }
    </section>
  );
}
