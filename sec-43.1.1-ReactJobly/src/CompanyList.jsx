import React, {useEffect, useState} from 'react'
import JoblyApi from './api'
import Alert from './Alert'
import CompanyCard from './CompanyCard'
import './CompanyList.css'

const EMPTY_SEARCH = {
  nameLike: ''
}

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState(EMPTY_SEARCH);
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
      <form onSubmit={handleSubmit}>
        <input type="text" id="nameLike" name="nameLike" placeholder="Enter search term" onChange={handleChange} value={search.nameLike} />
        <button type="button">Search</button>
      </form>
      <ul>
        {companies.map(c => <CompanyCard handle={c.handle} name={c.name} description={c.description} logoURL={c.logoUrl} key={c.handle} />)}
      </ul>
    </section>
  );

  function handleSubmit(e) {
    e.preventDefault();
    if(search.nameLike)
      setQuery(search);
    else
      setQuery(null);
  }

  function handleChange(e) {
    setSearch(s => ({
      ...s,
      [e.target.name]: e.target.value
    }));
  }
}
