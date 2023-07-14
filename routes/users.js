var express = require('express');
var router = express.Router();


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

module.exports = router;