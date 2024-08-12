import React from 'react'
import {useForm} from 'react-hook-form'
// import './SignupForm.css'

export default function SignupForm({signup}) {
  const {register, handleSubmit, formState: {errors}} = useForm();

  return (
    <form className="SignupForm" onSubmit={handleSubmit(async newUser => signup(newUser))}>
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
    </form>
  );
}
