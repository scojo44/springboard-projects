import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import JoblyApi from '../api'
import Alert from '../widgets/Alert'
// import './SignupForm.css'

export default function SignupForm() {
  const {register, handleSubmit, formState: {errors}} = useForm();
  const [signupError, setSignupError] = useState();
  const navigate = useNavigate();

  return (
    <form className="SignupForm" onSubmit={handleSubmit(registerUser)}>
      <h2>Sign Up</h2>

      <p>
        <label htmlFor="username">Username: </label>
        <input {...register("username", {required: 'Please enter your username'})} />
        {errors.username && <span className="input-error">{errors.username.message}</span>}
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input type="password" {...register("password", {required: 'Please choose a secure password'})} />
        {errors.password && <span className="input-error">{errors.password.message}</span>}
      </p>
      <p>
        <label htmlFor="firstName">First Name: </label>
        <input {...register("firstName", {required: 'Please enter your first name'})} />
        {errors.firstName && <span className="input-error">{errors.firstName.message}</span>}
      </p>
      <p>
        <label htmlFor="lastName">Last Name: </label>
        <input {...register("lastName", {required: 'Please enter your last name'})} />
        {errors.lastName && <span className="input-error">{errors.lastName.message}</span>}
      </p>
      <p>
        <label htmlFor="email">Email: </label>
        <input type="email" {...register("email", {required: 'Please enter your email address', pattern: /.+@[a-z0-9-]+/i})} />
        {errors.email && <span className="input-error">{errors.email.message}</span>}
      </p>

      <button type="submit">Sign Up</button>

      {signupError && <Alert type="error" messages={[`Error logging in: ${signupError}`]} />}
    </form>
  )

  async function registerUser({username, password, firstName, lastName, email}) {
    try {
      const token = await JoblyApi.signup(username, password, firstName, lastName, email);
      setSignupError(null);
      navigate('/');
    }
    catch(e) {
      setSignupError(e);
    }
  }
}
