var express = require("express");
var router = express.Router();
const {
  fetchPodcastGenres,
  fetchPodcast,
} = require("../routes/podcastService");

const { User, favorites } = require("../models");
const bcrypt = require("bcrypt");
const saltrounds = 10;
const jwt = require("jsonwebtoken");
const { Client } = require("podcast-api");
require("dotenv").config();
const api = process.env.APIKEY;
const client = Client({ apiKey: api });
const authCheck = require("../middleware/authCheck");
const session = require("express-session");
const sequelize = require("../config/database");

router.get("/register", function (req, res) {
  res.render("register", { title: "Create Your Account" });
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    console.log("existingUser", existingUser);
    if (existingUser) {
      return res.status(400).send("Username already taken.");
    }
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    res.redirect("/login");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("An error occurred while creating the user.");
  }
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
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
        const token = jwt.sign({ username: user.username, id: user.id }, "secretToken" );
        res.cookie("token", token);
        res.redirect("/profile");
      } else res.render("login", { title: "Login", error: "Passwords do not match" });
    });
  }
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = await User.findByPk(id);
  console.log(firstName, lastName, email, id);
  res.render("edit", { title: "Edit User", id, firstName, lastName, email });
});

router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = req.body;
  await User.update({ firstName, lastName, email }, { where: { id: id } });
  res.redirect(`/register`);
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const { firstName, lastName, email } = await User.findByPk(req.params.id);
  //console.log(firstName);
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
  await User.destroy({ where: { id } });
  res.send("Patch request delete user");
});

router.get("/profile", authCheck, async (req, res) => {
  try {
    const user_id = req.user.id;
    const favoritesList = await favorites.findAll({
      where: { user_id: user_id },
    });

    res.render("profile", {
      title: "Favorites List",
      favoritesList: favoritesList,
    });
  } catch (error) {
    console.error("Error retrieving Favorites List:", error);
    res
      .status(500)
      .send("An error occurred while retrieving the Favorites List.");
  }
});


router.get("/", async (req, res) => {
  try {
    const genres = await fetchPodcastGenres();

    res.render("home", { title: "Pick a Genre", genres: genres });
  } catch (error) {
    console.error("Error retrieving podcasts:", error);
    res.status(500).send("An error occurred while retrieving the podcasts.");
  }
});

router.get('/test', async (req, res) => {
  //console.log('hello')
})

router.post('/test', authCheck, async (req, res) => {
  let {user_id, podcast_id, podcast_title, podcast_image, podcast_audio} = req.body
  console.log(podcast_audio)
  //user_id = parseInt(user_id)
    try {
      await favorites.create({
        user_id: user_id,
        podcast_id: podcast_id,
        podcast_title: podcast_title,
        podcast_image: podcast_image,
        podcast_audio: podcast_audio
      });
  
      console.log('Favorite record created successfully');
      res.status(201).json({ message: 'Favorite record created successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.get("/podcast/:genreName/:genreId", async (req, res) => {
  try {
    const genreName = req.params.genreName;
    const genreId = req.params.genreId;
    const podcasts = await fetchPodcast(genreName, genreId);
    const title = podcasts.title_original;
    const token = req.cookies.token;
    let user_id;
  if (token) {
    const decodedToken = jwt.verify(token, "secretToken");
    user_id = decodedToken.id
  } else {
    user_id = null
  }
    res.render("podcast", { title: title, podcasts: podcasts, user_id: user_id});
  } catch (error) {
    console.error("Error retrieving podcasts:", error);
    res.status(500).send("An error occurred while retrieving the podcasts.");
  }
});

module.exports = router;
