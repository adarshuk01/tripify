const express = require('express');
const router = express.Router();
const { generateTrip, getTrips, getTrip, deleteTrip, regenerateTrip } = require('../controllers/trip.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateTrip } = require('../middleware/validate.middleware');

router.use(protect);

router.route('/').get(getTrips).post(validateTrip, generateTrip);
router.route('/:id').get(getTrip).delete(deleteTrip);
router.post('/:id/regenerate', regenerateTrip);

module.exports = router;
