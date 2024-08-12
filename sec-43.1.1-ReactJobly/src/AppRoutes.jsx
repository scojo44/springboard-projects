import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Home'
import CompanyList from './company/CompanyList'
import CompanyDetail from './company/CompanyDetail'
import JobList from './job/JobList'
import LoginForm from './user/LoginForm'
import SignupForm from './user/SignupForm'
import EditProfileForm from './user/EditProfileForm'

export default function RoutesList(login, signup) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/companies" element={<CompanyList />} />
      <Route path="/companies/:handle" element={<CompanyDetail />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      <Route path="/profile" element={<EditProfileForm />} />
    </Routes>
  );
}
