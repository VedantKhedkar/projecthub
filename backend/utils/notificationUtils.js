const Notification = require('../models/Notification')

const createNotification = async (userId, message, options = {}) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type: options.type || 'info',
      link: options.link || '',
      metadata: options.metadata || {}
    })

    await notification.save()
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

const createAdminNotification = async (message, options = {}) => {
  try {
    // This would require finding admin users
    // For now, create for first admin or all admins
    const User = require('../models/User')
    const admins = await User.find({ role: 'admin' })
    
    const notifications = []
    for (const admin of admins) {
      const notification = new Notification({
        user: admin._id,
        message,
        type: options.type || 'admin',
        link: options.link || '',
        metadata: options.metadata || {}
      })
      await notification.save()
      notifications.push(notification)
    }
    
    return notifications
  } catch (error) {
    console.error('Error creating admin notification:', error)
    return []
  }
}

module.exports = {
  createNotification,
  createAdminNotification
}