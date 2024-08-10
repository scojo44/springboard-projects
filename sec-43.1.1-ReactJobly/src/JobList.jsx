import React from 'react'
import JoblyApi from './api'
import useJoblyAPI from './hooks/useJoblyAPI'
import LoadingIndicator from './LoadingIndicator'
import Alert from './Alert'
import SearchForm from './SearchForm'
import JobCard from './JobCard'
import './JobList.css'

export default function JobList() {
  const {data: jobs, setParams, error, isLoading} = useJoblyAPI(JoblyApi.getJobs);

  if(isLoading) return <LoadingIndicator />;

  return (
    <section className="JobList">
      <SearchForm fieldName="titleLike" returnQuery={query => setParams(query)} />
      {error
        ? <Alert type="error" messages={[`Error loading jobs: ${error}`]} />
        : <ul>
            {jobs.map(j => <JobCard job={j} key={j.id} />)}
          </ul>
      }
    </section>
  );
}
