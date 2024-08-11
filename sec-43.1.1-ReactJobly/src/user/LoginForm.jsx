import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import JoblyApi from '../api'
import Alert from '../widgets/Alert'
// import './LoginForm.css'

export default function LoginForm() {
  const {register, handleSubmit, formState: {errors}} = useForm();
  const [loginError, setLoginError] = useState();
  const navigate = useNavigate();

  return (
    <form className="LoginForm" onSubmit={handleSubmit(loginUser)}>
      <h2>Log In</h2>

      <p>
        <label htmlFor="username">Username: </label>
        <input {...register("username", {required: true})} />
        {errors.usernameRequired && <span className="input-error">Please enter your username</span>}
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input type="password" {...register("password", {required: true})} />
        {errors.passwordRequired && <span className="input-error">Please enter your password</span>}
      </p>

      <button type="submit">Log In</button>

      {loginError && <Alert type="error" messages={[`Error logging in: ${loginError}`]} />}
    </form>
  )

  async function loginUser({username, password}) {
    try {
      const token = await JoblyApi.login(username, password);
      setLoginError(null);
      navigate('/');
    }
    catch(e) {
      setLoginError(e);
    }
  }
}
