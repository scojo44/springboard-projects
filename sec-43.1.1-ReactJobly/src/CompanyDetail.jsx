import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import JoblyApi from './api'
import Alert from './Alert'
import './CompanyDetail.css'

export default function CompanyDetail() {
  const {handle} = useParams();
  const [company, setCompany] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCompany() {
      try {
        const firm = await JoblyApi.getCompany(handle);
        setCompany(() => firm);
      }
      catch(e) {
        setError(e);
      }
    }

    fetchCompany();
  }, []);


  const {name, description, logoURL} = company;

  return (
    <section className="CompanyDetail">
      <div className="info">
        <h3>{name}</h3>
        <img src={logoURL} />
        <p>{description}</p>
      </div>
      <ul className="jobs">
        {error && <Alert type="error" messages={[`Error loading companies: ${error}`]} />}
      </ul>
    </section>
  )
}
