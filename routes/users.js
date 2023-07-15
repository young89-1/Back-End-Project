var express = require('express');
var router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const saltrounds =  10;
const jwt = require("jsonwebtoken")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// GET register new user
router.get('/register', function(req, res) {
  res.render('register', { title: 'Register a New User' });
  // console.log(register)
});


// POST register new user
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  console.log(req.body)

/* The code block is trying to find an existing user in the database using the `User.findOne()` method.
It is searching for a user with the same `username` as the one provided in the request body. */
try {
  const existingUser = await User.findOne({ where: { username } });
  console.log("existingUser",existingUser)
  if (existingUser) {
    // user already exists
    return res.status(400).send('Username already taken.');
  }

  // Create a new user
  const newUser = await User.create({ firstName, lastName, username, email, password });
  console.log("newUser",newUser)

    // Optionally, perform additional actions or redirect to a success page
    res.redirect('/users/login');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('An error occurred while creating the user.');
  }
});

// GET login page
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

// POST login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Insert authentication logic here
  // Verify the username and password against the stored user data
  const user = await User.findOne({
    where: { username },
  });

  if (user == null) {
    res.render("login", { title: "Login", error: "User not found" });
  } else {
    const hashedPW = user.password;
    await bcrypt.compare(password, hashedPW, function (err, result) {
      console.log(result);

      if (result) {
        const token = jwt.sign({ foo: "bar" }, "superSecretPrivateKey", {
          expiresIn: "1h",
        });
        console.log(token);

        res.cookie("token", token);
        res.redirect("/");
      } else res.render("login", { title: "Login", error: "Passwords do not match" });
    });
  }
  // If authentication is successful, redirect to a "redirected" page that is temporarily called /redirect
  // If authentication fails, show an error message or redirect to the login page

  res.redirect('/redirect'); // this is the web address to be redirected to after logging in successfully
});


module.exports = router;