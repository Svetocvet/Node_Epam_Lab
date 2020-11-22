const express = require('express');
const router = express.Router();

const {getTrucks, getTruck, createTruck, editTruck, deleteTruck, assignTruck} = require('../controllers/truckController');
const {ifDriverFree} = require('../middlewares/checkIfDriverFree');
const authMiddleware = require('../middlewares/authMiddleware');
const {driverRoleMiddleware} = require('../middlewares/roleMiddleware');

router.get('/trucks', authMiddleware, driverRoleMiddleware, getTrucks);
router.post('/trucks', authMiddleware, driverRoleMiddleware, ifDriverFree, createTruck);
router.get('/trucks/:id', authMiddleware, driverRoleMiddleware, getTruck);
router.put('/trucks/:id', authMiddleware, driverRoleMiddleware, ifDriverFree, editTruck);
router.delete('/trucks/:id', authMiddleware, driverRoleMiddleware, ifDriverFree, deleteTruck);
router.post('/trucks/:id/assign', authMiddleware, driverRoleMiddleware, ifDriverFree, assignTruck);

module.exports = router;
