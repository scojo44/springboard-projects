import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Home'
import CompanyList from './CompanyList'
import Company from './Company'
import JobList from './JobList'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import EditProfileForm from './EditProfileForm'

export default function RoutesList() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/companies" element={<CompanyList />} />
      <Route path="/companies/:handle" element={<Company />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/profile" element={<EditProfileForm />} />
    </Routes>
  )
}
