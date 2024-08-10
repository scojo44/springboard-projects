import React, { useState } from 'react'
import {Link, NavLink} from 'react-router-dom'
import './NavBar.css'
import Alert from './Alert';

export default function NavBar() {
  const [loggedOut, setLoggedOut] = useState(false);
  return (
    <>
    <nav className="NavBar">
      <Link to="/">Jobly</Link>
      <NavLink to="/companies">Companies</NavLink>
      <NavLink to="/jobs">Jobs</NavLink>
      <NavLink to="/login">Log In</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <Link onClick={() => setLoggedOut(true)}>Log Out</Link>
    </nav>
    {loggedOut && <Alert type="success" messages={['Logout Clicked!']} />}
    </>
  )
}
