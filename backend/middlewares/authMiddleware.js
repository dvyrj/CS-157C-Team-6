const authenticateUser = (req, res, next) => {
    console.log('This is where we will authenticate the user.');
    next();
}

module.exports = { authenticateUser }