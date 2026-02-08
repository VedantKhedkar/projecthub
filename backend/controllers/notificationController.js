import Notification from "../models/Notification.js";

// 📌 USER NOTIFICATIONS
export const getUserNotifications = async (req, res) => {
  try {
    const noti = await Notification.find({
      user: req.user.id,
      forAdmin: false
    }).sort({ createdAt: -1 });

    res.json(noti);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 ADMIN NOTIFICATIONS
export const getAdminNotifications = async (req, res) => {
  try {
    const noti = await Notification.find({
      forAdmin: true
    }).sort({ createdAt: -1 });

    res.json(noti);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 MARK AS READ
export const markAsRead = async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: "Not found" });

    n.isRead = true;
    await n.save();

    res.json({ success: true, message: "Updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
