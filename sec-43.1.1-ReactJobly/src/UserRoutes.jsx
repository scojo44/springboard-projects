import React, {useContext} from "react"
import {Navigate, Outlet} from "react-router-dom"
import CurrentUserContext from "./CurrentUserContext"

/** Wrapper for routes that require a login */

export default function UserRoutes() {
  const user = useContext(CurrentUserContext);

  return user? <Outlet /> : <Navigate to="/login" />;
}
