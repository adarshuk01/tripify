const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  place: String,
  description: String,
  time: String,
  duration: String,
  cost: String,
  mapsLink: String,
  imageQuery: String,
  type: String,
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: String,
  price: String,
  rating: String,
  description: String,
  mapsLink: String,
  amenities: [String],
  imageQuery: String,
}, { _id: false });

const foodStopSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  type: String,
  priceRange: String,
  mapsLink: String,
  imageQuery: String,
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: [activitySchema],
  hotel: hotelSchema,
  foodStops: [foodStopSchema],
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: [true, 'Destination is required'], trim: true },
  startingLocation: { type: String, default: '' },
  numberOfPeople: { type: Number, required: true, min: 1 },
  travelMode: { type: String, enum: ['Car', 'Bike', 'Bus', 'Train', 'Flight'], required: true },
  budget: { type: String, enum: ['Low', 'Medium', 'Luxury'], required: true },
  duration: { type: Number, required: true, min: 1 },
  preferences: [{ type: String }],
  travelParty: { type: String, enum: ['Solo', 'Couple', 'Family', 'Friends', 'Work'], default: 'Solo' },
  lunchStop: String,
  dinnerStop: String,
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  itinerary: {
    destination: String,
    summary: String,
    days: [daySchema],
    totalEstimatedCost: String,
    bestTimeToVisit: String,
    travelTips: [String],
  },
  isSaved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

tripSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('Trip', tripSchema);
