const express = require('express');
const router = express.Router();
const {ifDriverFree} = require('../middlewares/checkIfDriverFree');
const {getUser, deleteUser, changePassword, changePhoto} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/users/me', authMiddleware, getUser);
router.delete('/users/me', authMiddleware, ifDriverFree, deleteUser);
router.patch('/users/me/password', authMiddleware, ifDriverFree, changePassword);
router.patch('/users/me/photo', authMiddleware, changePhoto);

module.exports = router;
