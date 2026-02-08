import User from '../models/userModel.js';

// @desc    Get all users pending approval
// @route   GET /api/admin/pending-users
// @access  Private/Admin
export const getPendingUsers = async (req, res) => {
  // Detailed Logic: Find users who are NOT approved and are NOT admins
  const users = await User.find({ isApproved: false, isAdmin: false }).select('-password');
  res.json(users);
};

// @desc    Approve a user registration
// @route   POST /api/admin/users/approve
// @access  Private/Admin
export const approveUser = async (req, res) => {
  const user = await User.findById(req.body.userId);

  if (user) {
    user.isApproved = true;
    await user.save();
    res.json({ message: 'User approved successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Reject/Delete a user registration
// @route   POST /api/admin/users/reject
// @access  Private/Admin
export const rejectUser = async (req, res) => {
  const user = await User.findById(req.body.userId);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User registration rejected and removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};