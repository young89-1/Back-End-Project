// middleware/authCheck.js
const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    // No token found, user is not authenticated
    res.redirect("/login");
  } else {
    try {
      // Verify the JWT token and extract user data
      const decodedToken = jwt.verify(token, "secretToken");
      req.user = decodedToken; // Set the user data in the request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // Token verification failed, user is not authenticated
      res.redirect("/login");
    }
  }
};

module.exports = authCheck;
