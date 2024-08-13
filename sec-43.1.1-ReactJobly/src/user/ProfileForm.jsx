import React, {useContext} from 'react'
import {useForm} from 'react-hook-form'
import CurrentUserContext from '../CurrentUserContext'
// import './ProfileForm.css'

export default function ProfileForm({update}) {
  const user = useContext(CurrentUserContext);
  const {register, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  });

  return (
    <form className="ProfileForm" onSubmit={handleSubmit(async credentials => await update(credentials))}>
      <h2>Edit Profile</h2>
      <p>
        <label htmlFor="username">Username: </label>
        <input readOnly {...register("username")} />
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input type="password" {...register("password")} />
        {errors.password && <span className="input-error"> {errors.password.message}</span>}
      </p>
      <p>
        <label htmlFor="confirm">Confirm Password: </label>
        <input type="password" {...register("confirm", {validate: (cp, values) => cp === values.password || 'Your passwords do not match'})} />
        {errors.confirm && <span className="input-error"> {errors.confirm.message}</span>}
      </p>
      <p>
        <label htmlFor="firstName">First Name: </label>
        <input {...register("firstName", {required: 'Please enter your first name'})} />
        {errors.firstName && <span className="input-error"> {errors.firstName.message}</span>}
      </p>
      <p>
        <label htmlFor="lastName">Last Name: </label>
        <input {...register("lastName", {required: 'Please enter your last name'})} />
        {errors.lastName && <span className="input-error"> {errors.lastName.message}</span>}
      </p>
      <p>
        <label htmlFor="email">Email: </label>
        <input type="email" {...register("email", {required: 'Please enter your email address', pattern: /.+@[a-z0-9-]+/i})} />
        {errors.email && <span className="input-error"> {errors.email.message}</span>}
      </p>
      <button type="submit">Save</button>
    </form>
  );
}
