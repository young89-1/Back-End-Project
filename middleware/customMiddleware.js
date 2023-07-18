const helloMiddleware = (req, res, next) => {
    console.log("Hello I am middleware");
    next();
}

module.exports = {
    helloMiddleware
};