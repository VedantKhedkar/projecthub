const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CustomRequest = require('./models/CustomRequest');
const User = require('./models/User');

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // 1. Count Requests
    const count = await CustomRequest.countDocuments();
    console.log(`📊 Total Custom Requests in DB: ${count}`);

    if (count > 0) {
      // 2. List Requests
      const requests = await CustomRequest.find({}).populate('user', 'name email');
      console.log("\n--- 📝 LIST OF REQUESTS ---");
      requests.forEach(req => {
        console.log(`🔹 Title: ${req.title}`);
        console.log(`   User: ${req.user ? req.user.email : 'UNKNOWN USER'}`);
        console.log(`   User ID: ${req.user ? req.user._id : req.user}`);
        console.log(`   Status: ${req.status}`);
        console.log("---------------------------");
      });
    } else {
        console.log("❌ The Database is EMPTY. The submit function is not saving data.");
    }
    
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkData();