import React from 'react'
import {useForm} from 'react-hook-form'
// import './LoginForm.css'

export default function LoginForm({login}) {
  const {register, handleSubmit, formState: {errors}} = useForm();

  return (
    <form className="LoginForm" onSubmit={handleSubmit(async credentials => await login(credentials))}>
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
    </form>
  );
}
