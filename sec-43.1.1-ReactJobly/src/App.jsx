import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import JoblyApi from './api'
import useLocalStorageState from './hooks/useLocalStorageState'
import CurrentUserContext from './CurrentUserContext'
import NavBar from './widgets/NavBar'
import Alert from './widgets/Alert'
import AppRoutes from './AppRoutes'
import './App.css'

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [userToken, setUserToken] = useLocalStorageState('43.1.1-JoblyUserToken');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function updateCurrentUser() {
      const {username} = jwtDecode(userToken);

      JoblyApi.token = userToken;
      const user = await JoblyApi.getUser(username);
      setCurrentUser(user);
    }

    userToken? updateCurrentUser() : setCurrentUser(null);
  }, [userToken]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <NavBar logout={logout} />
      {alerts && <Alert alerts={alerts} dismiss={dismissAlert} />}
      <main>
        <AppRoutes login={login} signup={signup} />
      </main>
    </CurrentUserContext.Provider>
  );

  /** signup: Register a new user */

  async function signup(newUser) {
    try { processUserToken(await JoblyApi.signup(newUser)); }
    catch(e) {
      showAlert('error', 'Registration failed: ' + e);
    }
  }

  /** login: Log in the user */

  async function login(credentials) {
    try { processUserToken(await JoblyApi.login(credentials)); }
    catch(e) {
      showAlert('error', 'Login failed: ' + e);
    }
  }

  async function processUserToken(token) {
    setAlerts([]);
    setUserToken(token);
    navigate('/');
  }

  /** logout: Log out the user */

  async function logout() {
    setUserToken(null);
  }

  /** showAlert: Show a message at the top */

  async function showAlert(category, message) {
    if(alerts.find(a => a.category === category && a.message === message)) return; // Ingore existing message
    setAlerts(alerts => [...alerts, {category, message}]);
  }

  /** dismissAlert: Dismiss the alert message */

  async function dismissAlert(alert) {
    setAlerts(alerts => alerts.filter(a => a.category !== alert.category || a.message !== alert.message));
  }
}
