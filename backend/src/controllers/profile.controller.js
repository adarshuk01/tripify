const User = require('../models/User.model');

// @desc    Get profile
// @route   GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// @desc    Update profile
// @route   PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'country', 'gender', 'avatar', 'travelPreferences'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (err) { next(err); }
};

// @desc    Change password
// @route   PUT /api/profile/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user._id).select('+password');
    const match = await user.comparePassword(currentPassword);
    if (!match)
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) { next(err); }
};

// @desc    Delete account
// @route   DELETE /api/profile
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
