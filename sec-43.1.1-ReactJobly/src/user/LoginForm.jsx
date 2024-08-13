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
        <input {...register("username", {required: 'Please enter your username'})} />
        {errors.username && <span className="input-error"> {errors.username.message}</span>}
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input type="password" {...register("password", {required: 'Please enter your password'})} />
        {errors.password && <span className="input-error"> {errors.password.message}</span>}
      </p>
      <button type="submit">Log In</button>
    </form>
  );
}
