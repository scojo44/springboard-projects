import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import JoblyApi from './api'
import useLocalStorageState from './hooks/useLocalStorageState'
import UserContext from './UserContext'
import NavBar from './widgets/NavBar'
import Alert from './widgets/Alert'
import AppRoutes from './AppRoutes'
import './App.css'

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useLocalStorageState('43.1.1-JoblyUserToken');
  const [appliedJobIDs, setAppliedJobIDs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function updateCurrentUser() {
      const {username} = jwtDecode(userToken);
      JoblyApi.token = userToken;

      try {
        const user = await JoblyApi.getUser(username);
        setAppliedJobIDs(new Set(user.jobs.map(j => j.id)));
        setCurrentUser(user);
      }
      catch(e) {
        showAlert('error', 'Error loading user info: ' + e);
      }
    }

    userToken? updateCurrentUser() : setCurrentUser(null);
  }, [userToken]);

  return (
    <UserContext.Provider value={{currentUser, appliedJobIDs, applyToJob}}>
      <NavBar logout={logout} />
      {alerts && <Alert alerts={alerts} dismiss={dismissAlert} />}
      <main>
        <AppRoutes login={login} signup={signup} updateUser={updateUser} />
      </main>
    </UserContext.Provider>
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

  /** updateUser: Register a new user */

  async function updateUser(user) {
    // Remove passwords if not changing
    if(!user.password) delete user.password;
    delete user.confirm;

    try {
      const updated = await JoblyApi.updateUser(user);
      setAlerts([]);
      showAlert('success', 'Your profile was updated')
      setCurrentUser(updated);
    }
    catch(e) {
      showAlert('error', 'Update profile failed: ' + e);
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

  /** applyToJob: Marks a job as applied by the current user */

  async function applyToJob(jobID) {
    try {
      const applied = await JoblyApi.applyToJob(currentUser.username, jobID);
      setAppliedJobIDs(new Set(appliedJobIDs.add(jobID)));
    }
    catch(e) {
      showAlert('error', 'Error applying to a job: ' + e);
    }
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
