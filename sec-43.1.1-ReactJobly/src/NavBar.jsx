import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  return (
    <nav className="NavBar">
      <Link to="/">Jobly</Link>
      <NavLink to="/companies">Companies</NavLink>
      <NavLink to="/jobs">Jobs</NavLink>
      <NavLink to="/login">Log In</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink onClick={() => window.alert('Logged out')}>Log Out</NavLink>
    </nav>
  )
}
