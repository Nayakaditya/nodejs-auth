# Node.js Authentication App

A Node.js application that provides user authentication features such as sign up, sign in, social authentication (Google), forgot password, reset password, and sign out. User details are stored in a MongoDB database.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js v12+
- MongoDB
- A Google Developer account to set up social authentication
- Google Chrome

### Installation

1. Clone the repository:

2. Install the dependencies:
   "bcryptjs": "^2.4.3",
   "connect-flash": "^0.1.1",
   "connect-mongo": "^3.2.0",
   "cookie-parser": "^1.4.6",
   "dotenv": "^16.0.3",
   "ejs": "^3.1.8",
   "express": "^4.18.2",
   "express-ejs-layouts": "^2.5.1",
   "express-session": "^1.17.3",
   "jsonwebtoken": "^9.0.0",
   "mongoose": "^7.0.0",
   "nodemailer": "^6.9.1",
   "passport": "^0.6.0",
   "passport-google-oauth": "^2.0.0",
   "passport-google-oauth2": "^0.2.0",
   "passport-local": "^1.0.0",
   "validator": "^13.9.0"

3. Create a `.env` file in the root directory of the project and add the following environment variables:

4. Create a `.gitignore` file in the root directory of the project to TELL git to ignore these files:

5. Start the server:

6. Go to http://localhost:8888/page/signup in your browser to see the app in action.

## Usage

- Sign up for an account
- Sign in with your email and password
- Sign in with Google (social authentication)
- Forgot password and reset password
- Sign out

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
