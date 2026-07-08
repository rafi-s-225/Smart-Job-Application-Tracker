# Smart Job Application Tracker

A full-stack web application that helps students and job seekers organize and track their job applications in one place, from application to offer or rejection.

## About This Project

Job seekers often apply to many companies at once and lose track of application dates, deadlines, and interview stages. This application solves that problem by letting users manage all their job applications from a single dashboard, with secure login so each user's data stays private.

## Features

- User registration and login with secure password hashing using bcrypt
- JWT based authentication with protected backend routes
- Add, view, update, and delete job applications
- Track applications through stages: Applied, Interview, Offer, Rejected
- Store company name, job role, application date, deadline, and personal notes
- Each user only sees their own job applications, not other users' data

## Technologies Used

**Frontend:** React, React Router, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Authentication:** JSON Web Tokens (JWT), bcryptjs for password hashing

## How It Works

1. A user registers with a name, email, and password. The password is hashed using bcrypt before being stored, so the actual password is never saved in the database.
2. On login, the server checks the entered password against the hashed one, and if correct, issues a JWT token.
3. This token is stored in the browser and sent with every future request to prove the user is logged in.
4. Backend middleware checks this token on protected routes before allowing access, and blocks the request if the token is missing or invalid.
5. Every job application is linked to the user who created it, so the backend only returns applications belonging to the logged-in user.

## Running This Project Locally

Clone the repository: