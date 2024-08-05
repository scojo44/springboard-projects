# React Jobly

## Step One: Design Component Hierarchy

*Router
- App (no props, no state)
  - Routes
    - Route

LoginForm - /login
- state managed by form library
SignupForm - /signup
- state managed by form library
ProfileForm - /profile
- UpdateUserForm
  - updateUser: function to update the user in the list
  - state managed by form library
  - UserFields

CompanyList - /companies
- state: companies
- link to Company
- NewCompanyForm
  - props
    - addCompany: function to add the new company to the list
  - state managed by form library
  - CompanyFields
- UpdateCompanyForm
  - props
    - updateCompany: function to update the company in the list
  - state managed by form library
  - CompanyFields

Company - /companies/:id
- JobList
  - props
    - jobs: Open jobs listed by the company
  - link to Job

JobList - /jobs
- state: jobs
- link to Job
- NewJobForm
  - props
    - addJob: function to add the new job to the list
  - state managed by form library
  - JobFields
- UpdateJobForm
  - props
    - updateJob: function to update the job in the list
  - state managed by form library
  - JobFields

Job - /jobs/:id
- link to company

### Further Study?  For admins:

UserList - /users
- state: users
- link to User
- NewUserForm
  - props
    - addUser: function to add the new user to the list
  - state managed by form library
  - UserFields
- UpdateUserForm
  - props
    - updateUser: function to update the user in the list
  - state managed by form library
  - UserFields

User - /users/:username
- JobList - /users/:username/jobs
  - props
    - jobs: Jobs applied to by the user
  - link to Job

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
