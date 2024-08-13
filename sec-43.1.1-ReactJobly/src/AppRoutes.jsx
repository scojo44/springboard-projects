import React from 'react'
import {Routes, Route} from 'react-router-dom'
import UserRoutes from './UserRoutes'
import Home from './Home'
import CompanyList from './company/CompanyList'
import CompanyDetail from './company/CompanyDetail'
import JobList from './job/JobList'
import LoginForm from './user/LoginForm'
import SignupForm from './user/SignupForm'
import ProfileForm from './user/ProfileForm'

export default function AppRoutes({login, signup, updateUser}) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      <Route element={<UserRoutes />}>
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:handle" element={<CompanyDetail />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/profile" element={<ProfileForm update={updateUser} />} />
      </Route>
    </Routes>
  );
}
