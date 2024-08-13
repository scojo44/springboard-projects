import React, {useContext} from 'react'
import CurrentUserContext from './CurrentUserContext';
import './Home.css'

export default function Home() {
  const user = useContext(CurrentUserContext);

  return (
    <section className="Home">
      <h2>Welcome, {user? user.firstName : 'guest'}!</h2>
    </section>
  );
}
