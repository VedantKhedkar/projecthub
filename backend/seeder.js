const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const PrebuiltProject = require('./models/PrebuiltProject');
const User = require('./models/User');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // 1. Clear Database
    await PrebuiltProject.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed...');

    // 2. Create Admin User
    // The User model's pre-save hook will automatically hash the password 'admin'
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@projecthub.com',
      password: 'admin123',
      isAdmin: true,
      isApproved: true,
    });

    console.log(`Admin Created: ${adminUser.email} / admin`);

    // 3. Generate 20 Dummy Projects
    const projects = [];
    const categories = ["MERN Stack", "Full Stack", "AI/ML", "Frontend", "Backend"];
    
    // Helper data for variety
    const titles = [
      "E-Commerce Pro", "Social Network V2", "Fitness AI Tracker", "Restaurant POS", "Crypto Dashboard",
      "Learning Management System", "Real Estate Portal", "Chat Application", "Task Manager Pro", "Weather Forecast App",
      "Expense Tracker", "Blog CMS", "Job Board Platform", "Event Booking System", "Video Streaming App",
      "Recipe Finder", "Portfolio Builder", "Inventory System", "Hotel Booking App", "Music Player Stream"
    ];

    const techStacks = [
      ["React", "Node.js", "MongoDB", "Redux"],
      ["Next.js", "Tailwind", "Supabase"],
      ["Python", "Django", "React"],
      ["Vue.js", "Firebase", "Pinia"],
      ["Angular", "Express", "PostgreSQL"],
      ["MERN", "Socket.io", "ChakraUI"]
    ];

    const images = [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", // Dashboard
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800", // Social
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800", // Fitness
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", // Analytics
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800", // Code
    ];

    for (let i = 0; i < 20; i++) {
      projects.push({
        title: titles[i] || `Project ${i + 1}`,
        category: categories[i % categories.length],
        price: Math.floor(Math.random() * (15000 - 2000) + 2000), // Random price between 2000-15000
        description: `This is a premium ${categories[i % categories.length]} project. It includes full source code, setup guide, and assets. Perfect for students and startups looking for a ${titles[i]} solution. Features include authentication, database integration, and responsive design.`,
        techStack: techStacks[i % techStacks.length],
        image: images[i % images.length],
        demoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Dummy link
        salesCount: Math.floor(Math.random() * 50),
        sourceCodeZip: "https://example.com/source.zip",
        assetsZip: "https://example.com/assets.zip"
      });
    }

    await PrebuiltProject.insertMany(projects);
    console.log('20 Dummy Projects Imported!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();