const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/users/login");
  } else {
    try {
      const decodedToken = jwt.verify(token, "secretToken");
      req.user = decodedToken; 
      next(); 
    } catch (error) {
  
      res.redirect("/users/login");
    }
  }
};

module.exports = authCheck;