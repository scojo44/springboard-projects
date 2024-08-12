import React, {useState} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import JoblyApi from './api'
import CurrentUserContext from './CurrentUserContext'
import NavBar from './widgets/NavBar'
import Alert from './widgets/Alert'
import Home from './Home'
import CompanyList from './company/CompanyList'
import CompanyDetail from './company/CompanyDetail'
import JobList from './job/JobList'
import LoginForm from './user/LoginForm'
import SignupForm from './user/SignupForm'
import EditProfileForm from './user/EditProfileForm'
import './App.css'

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [userToken, setUserToken] = useState();
  const [alerts, setAlerts] = useState([]);

  return (
    <CurrentUserContext.Provider value={userToken}>
      <NavBar logout={logout} />
      {alerts && <Alert alerts={alerts} dismiss={dismissAlert} />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companies/:handle" element={<CompanyDetail />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/login" element={<LoginForm login={login} />} />
          <Route path="/signup" element={<SignupForm signup={signup} />} />
          <Route path="/profile" element={<EditProfileForm />} />
        </Routes>
      </main>
    </CurrentUserContext.Provider>
  );

  /** signup: Register a new user */

  async function signup(newUser) {
    try {
      const token = await JoblyApi.signup(newUser);
      setAlerts([]);
      setUserToken(token);
      navigate('/');
    }
    catch(e) {
      showAlert('error', 'Registration failed: ' + e);
    }
  }

  /** login: Log in the user */

  async function login(credentials) {
    try {
      const token = await JoblyApi.login(credentials);
      setAlerts([]);
      setUserToken(token);
      navigate('/');
    }
    catch(e) {
      showAlert('error', 'Login failed: ' + e);
    }
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
