var express = require('express');
var router = express.Router();
const { fetchPodcastGenres, fetchPodcast } = require('../public/stylesheets/podcastService');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const saltrounds =  10;
const jwt = require("jsonwebtoken")
const { Client } = require('podcast-api');
require("dotenv").config();
const api = process.env.APIKEY;
const client = Client({ apiKey: api });
const authCheck = require('../middleware/authCheck');
const session = require('express-session')


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// GET register new user http://localhost:3000/users/register
router.get('/register', function(req, res) {
  res.render('register', { title: 'Create Your Account' });
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

// GET login page http://localhost:3000/users/login
// GET login page
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

// POST login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Insert middleware/authentication logic here
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
        const token = jwt.sign({ foo: "bar" }, "secretToken", {
          expiresIn: "1h",
        });
        console.log(token);

        res.cookie("token", token);
        res.redirect("/users/profile");
      } else res.render("login", { title: "Login", error: "Passwords do not match" });
    });
  }
  // If authentication is successful, redirect to a "redirected" page that is temporarily called /redirect
});

// GET EDIT user (load a template)
router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = await User.findByPk(id);
  console.log(firstName, lastName, email, id);
  res.render("edit", { title: "Edit User", id, firstName, lastName, email });
  });

//PUT or PATCH edit a user
router.post('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = req.body;
  await User.update({ firstName, lastName, email }, { where: { id: id } });
  res.redirect(`/users/register`);
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const { firstName, lastName, email } = await User.findByPk(req.params.id);
  console.log(firstName);
  res.render("delete", {
    title: "Delete User",
    id,
    firstName,
    lastName,
    email,
  });
});

router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await User.destroy({ where: { id: id } });
  res.send("Patch request delete user");
});

// GET watch list page
router.get('/Profile', authCheck, async (req, res) => {
  try {
    // Retrieve user's favorite's list from database
    const favoritesList = await favorites.findAll({ where: { user_id: user_id } 
    });
  
  res.render('Profile', { title: 'Favorites List', favoritesList });
  } catch (error) {
    console.error('Error retreiving Favorites List:', error);
    res.status(500).send('An error occurred while retreiving the Favorites List.');
  }
});

router.get('/', async (req, res) => {
  try {
const genres = await fetchPodcastGenres();

res.render('home', { title: 'Pick a Genre', genres: genres });
  
  } catch (error) {
    console.error('Error retrieving podcasts:', error);
    res.status(500).send('An error occurred while retrieving the podcasts.');
  }
});

router.get('/podcast/:genreName/:genreId', async (req, res) => {
  try {
const genreName = req.params.genreName;
const genreId = req.params.genreId;

const podcasts = await fetchPodcast(genreName, genreId);
const title = podcasts.title_original;

res.render('podcast', { title: title, podcasts: podcasts });

} catch (error) {
  console.error('Error retrieving podcasts:', error);
  res.status(500).send('An error occurred while retrieving the podcasts.');
}
});


module.exports = router;