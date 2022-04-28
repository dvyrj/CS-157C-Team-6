const express = require('express');
const { getAccounts } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const app = express();

const router = express.Router();

router.get('/users', authenticateUser, getAccounts);

module.exports = router
