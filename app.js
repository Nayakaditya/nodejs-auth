// Importing required modules
require("dotenv").config(); // Load environment variables
const cookieParser = require("cookie-parser"); // Parse cookies from incoming requests
const express = require("express"); // Import express framework
const flash = require("connect-flash"); // Display flash messages
const userRouter = require("./routes/user_router"); // Import user router
const { PORT, SESSION_SECRET } = process.env; // Extract environment variables
const expressLayouts = require("express-ejs-layouts"); // Enable EJS layouts
const db = require("./configs/mongoose"); // Connect to database

// Used for session cookie
const session = require("express-session");

// Using Passport authentication
const passport = require("passport"); // Authentication middleware
const passportLocal = require("./configs/passport-local"); // Passport local strategy
const passportGoogle = require("./configs/passport-google-oauth2"); // Passport Google strategy

// Store session in DB
const MongoStore = require("connect-mongo")(session); // Store sessions in MongoDB

const app = express(); // Create a new express application

// Use middleware
app.use(cookieParser()); // Parse cookies
app.use(expressLayouts); // Enable EJS layouts
app.use(express.static("./assets")); // Serve static files
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", "./views"); // Set views directory
app.set("layout extractStyles", true); // Extract styles to layout
app.set("layout extractScripts", true); // Extract scripts to layout

// Use express-session middleware to store session data
app.use(
  session({
    name: "nodejsauth", // Name of the cookie
    secret: SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Save the session on every request, regardless of whether it has been modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      secure: true, // Cookies can only be sent over HTTPS
      maxAge: 3600000, // Cookie lifespan in milliseconds
    },
    store: new MongoStore(
      {
        mongooseConnection: db, // MongoDB connection
        autoRemove: "disabled", // Do not remove expired sessions
      },
      function (err) {
        console.log("connect mongo setup ok" || err);
      }
    ),
  })
);

app.use(flash()); // Enable flash messages

// Use Passport middleware to authenticate requests
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Use Passport for persistent login sessions
app.use(passport.setAuthenticatedUser); // Set the current user on the request object

app.use("/", userRouter); // Use user router

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Success http://localhost:${PORT}/`);
});
