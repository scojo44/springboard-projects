import React from 'react'
import JoblyApi from './api'
import useJoblyAPI from './hooks/useJoblyAPI'
import LoadingIndicator from './LoadingIndicator'
import Alert from './Alert'
import SearchForm from './SearchForm'
import CompanyCard from './CompanyCard'
import './CompanyList.css'

export default function CompanyList() {
  const {data: companies, setParams, error, isLoading} = useJoblyAPI(JoblyApi.getCompanies);

  if(isLoading) return <LoadingIndicator />;

  return (
    <section className="CompanyList">
      <SearchForm fieldName="nameLike" returnQuery={query => setParams(query)} />
      {error
        ? <Alert type="error" messages={[`Error loading companies: ${error}`]} />
        : <ul>
            {companies.map(c => <CompanyCard company={c} key={c.handle} />)}
          </ul>
      }
    </section>
  );
}
