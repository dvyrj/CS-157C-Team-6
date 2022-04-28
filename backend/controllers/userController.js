const { getUserAccounts } = require('../services/userService.js')

const getAccounts = (req, res, next) => {
    let userAccounts = getUserAccounts();
    res.json(userAccounts);
}

module.exports = { getAccounts }