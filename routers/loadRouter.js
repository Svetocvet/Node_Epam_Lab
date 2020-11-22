const express = require('express');
const router = express.Router();

const {getLoads, createLoad, getActiveLoad, iterateToNextLoad, getLoad, updateLoad, deleteLoad, postLoad, getLoadShippingInfo} = require('../controllers/loadController');
const authMiddleware = require('../middlewares/authMiddleware');
const {driverRoleMiddleware, shipperRoleMiddleware} = require('../middlewares/roleMiddleware');

router.get('/loads', authMiddleware, getLoads);
router.post('/loads', authMiddleware, shipperRoleMiddleware, createLoad);
router.get('/loads/active', authMiddleware, driverRoleMiddleware, getActiveLoad);
router.patch('/loads/active/state', authMiddleware, driverRoleMiddleware, iterateToNextLoad);
router.get('/loads/:id', authMiddleware, getLoad);
router.put('/loads/:id', authMiddleware, shipperRoleMiddleware, updateLoad);
router.delete('/loads/:id', authMiddleware, shipperRoleMiddleware, deleteLoad);
router.post('/loads/:id/post', authMiddleware, shipperRoleMiddleware, postLoad);
router.get('/loads/:id/shipping_info', authMiddleware, shipperRoleMiddleware, getLoadShippingInfo);

module.exports = router;
