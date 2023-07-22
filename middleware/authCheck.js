const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
    let token = req.cookies.token
    console.log("token", token)
    console.log("Auth check middleware has fired");
    let decoded = null;
    try{
        decoded = jwt.verify(token, 'secretToken');
        console.log(decoded);
    }   catch (error) {
        console.log(error);
    }

    if (decoded) {
      next();
    } else {
      res.redirect('/users/login')
      };
    };


module.exports = authCheck;