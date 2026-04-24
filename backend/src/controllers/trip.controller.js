const Trip = require('../models/Trip.model');
const { generateItinerary } = require('../services/ai.service');

// @desc    Generate a new trip
// @route   POST /api/trips/generate
// @access  Private
const generateTrip = async (req, res, next) => {
  try {
    const {
      destination,
      startingLocation,
      numberOfPeople,
      travelMode,
      budget,
      duration,
      preferences,
      travelParty,
      lunchStop,
      dinnerStop,
      startDate,
      endDate,
    } = req.body;

    const itinerary = await generateItinerary({
      destination,
      startingLocation,
      numberOfPeople,
      travelMode,
      budget,
      duration,
      preferences: preferences || [],
      travelParty: travelParty || 'Solo',
      lunchStop,
      dinnerStop,
    });

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startingLocation,
      numberOfPeople,
      travelMode,
      budget,
      duration,
      preferences: preferences || [],
      travelParty: travelParty || 'Solo',
      lunchStop,
      dinnerStop,
      startDate: startDate || null,
      endDate: endDate || null,
      itinerary,
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trips for user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [trips, total] = await Promise.all([
      Trip.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-itinerary.days'),
      Trip.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      data: trips,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
const getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate itinerary for existing trip
// @route   POST /api/trips/:id/regenerate
// @access  Private
const regenerateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const itinerary = await generateItinerary({
      destination: trip.destination,
      startingLocation: trip.startingLocation,
      numberOfPeople: trip.numberOfPeople,
      travelMode: trip.travelMode,
      budget: trip.budget,
      duration: trip.duration,
      preferences: trip.preferences,
      travelParty: trip.travelParty,
      lunchStop: trip.lunchStop,
      dinnerStop: trip.dinnerStop,
    });

    trip.itinerary = itinerary;
    await trip.save();

    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateTrip, getTrips, getTrip, deleteTrip, regenerateTrip };
