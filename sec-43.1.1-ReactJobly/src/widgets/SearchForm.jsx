import React, { useState } from 'react'
import './SearchForm.css'

export default function SearchForm({fieldName, returnQuery}) {
  const EMPTY_SEARCH = {
    [fieldName]: ''
  }
  const [search, setSearch] = useState(EMPTY_SEARCH);

  return (
    <form className="SearchForm" onSubmit={handleSubmit}>
      <input type="text" id={fieldName} name={fieldName} placeholder="Enter search term" onChange={handleChange} value={search[fieldName]} />
      <button type="button">Search</button>
    </form>
  );

  function handleSubmit(e) {
    e.preventDefault();
    returnQuery(search[fieldName]? search : null);
  }

  function handleChange(e) {
    setSearch(s => ({
      ...s,
      [e.target.name]: e.target.value
    }));
  }
}
