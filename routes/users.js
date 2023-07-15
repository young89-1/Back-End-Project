var express = require('express');
var router = express.Router();
const { fetchPodcastGenres } = require('./podcastService');


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


// GET register new user http://localhost:3000/users/register
router.get('/register', function(req, res) {
  res.render('register', { title: 'Register a New User' });
});


// POST register new user
router.post('/register', async function(req, res) {
  const { firstName, lastName, username, email, password } = req.body;

try {
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    // user already exists
    return res.status(400).send('Username already taken.');
  }

  // Create a new user
  const newUser = await User.create({ firstName, lastName, username, email, password });

    // Optionally, perform additional actions or redirect to a success page
    res.redirect('/login');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('An error occurred while creating the user.');
  }
});



// GET login page http://localhost:3000/users/login
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

// POST login user
router.post('/login', function(req, res) {
  const { username, password } = req.body;

  // Insert middleware/authentication logic here
  // Verify the username and password against the stored user data

  // If authentication is successful, redirect to a "redirected" page that is temporarily called /redirect
  // If authentication fails, show an error message or redirect to the login page

  res.redirect('/'); // this is the web address to be redirected to after logging in successfully
});


// GET watch list page
router.get('/Profile', async (req, res) => {
  try {
    // Retrieve user's favorite's list from database
    const favoritesList = await FavoritesList.findAll({ where: { userId: req.user.id } 
    });
  
  res.render('Profile', { title: 'Favorites List', favoritesList });
  } catch (error) {
    console.error('Error retreiving Favorites List:', error);
    res.status(500).send('An error occurred while retreiving the Favorites List.');
  }
});

// GET home page
router.get('/', async (req, res) => {
  try {

const { duration, genre } = req.query;



    // Fetch podcast genres using the podcastService
    const genres = await fetchPodcastGenres();

    // Make the API request to fetch the podcast data
    const podcasts = await fetchPodcastsFromAPI(duration, category);

    // Retrieve the podcast data based on the selected duration and category
    // const podcasts = await fetchPodcasts(req.query.duration, req.query.category);

    res.render('home', { title: 'Home', genres, podcasts });
    
  } catch (error) {
    console.error('Error retrieving podcasts:', error);
    res.status(500).send('An error occurred while retrieving the podcasts.');
  }
});

module.exports = router;