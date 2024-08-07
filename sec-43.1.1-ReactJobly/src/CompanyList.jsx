import React, {useEffect, useState} from 'react'
import JoblyApi from './api'
import Alert from './Alert'
import SearchForm from './SearchForm'
import CompanyCard from './CompanyCard'
import './CompanyList.css'

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const firms = await JoblyApi.getCompanies(query);
        setCompanies(() => [...firms]);
        setError('');
      }
      catch(e) {
        setError(e);
      }
    }

    fetchCompanies();
  }, [query]);

  return (
    <section className="CompanyList">
      {error && <Alert type="error" messages={[`Error loading companies: ${error}`]} />}
      <SearchForm fieldName="nameLike" returnQuery={search => setQuery(() => search)} />
      <ul>
        {companies.map(c => <CompanyCard company={c} key={c.handle} />)}
      </ul>
    </section>
  );
}
