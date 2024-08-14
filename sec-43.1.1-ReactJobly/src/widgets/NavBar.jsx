import React, {useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import UserContext from '../UserContext'
import './NavBar.css'

export default function NavBar({logout}) {
  const {currentUser} = useContext(UserContext);
  return (
    <>
    <nav className="NavBar">
      <Link to="/">Jobly</Link>
      {currentUser
        ? <>
            <NavLink to="/companies">Companies</NavLink>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <Link onClick={logout}>Log Out</Link>
            <span>{currentUser.username}</span>
          </>
        : <>
            <NavLink to="/signup">Sign Up</NavLink>
            <NavLink to="/login">Log In</NavLink>
          </>
      }
    </nav>
    </>
  );
}
