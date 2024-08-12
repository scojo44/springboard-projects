import React, {useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import CurrentUserContext from '../CurrentUserContext';
import './NavBar.css'

export default function NavBar({logout}) {
  const user = useContext(CurrentUserContext);

  return (
    <>
    <nav className="NavBar">
      <Link to="/">Jobly</Link>
      <NavLink to="/companies">Companies</NavLink>
      <NavLink to="/jobs">Jobs</NavLink>
      {user
        ? <>
            <NavLink to="/profile">Profile</NavLink>
            <Link onClick={logout}>Log Out</Link>
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
