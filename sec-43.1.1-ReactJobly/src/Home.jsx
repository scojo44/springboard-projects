import React, {useContext} from 'react'
import UserContext from './UserContext'
import './Home.css'

export default function Home() {
  const {currentUser} = useContext(UserContext);

  return (
    <section className="Home">
      <h2>Welcome, {currentUser? currentUser.firstName : 'guest'}!</h2>
    </section>
  );
}
