import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

// Public & Auth Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentLogs from './pages/admin/PaymentLogs';

// User Pages
import RequestCustom from './pages/user/RequestCustom';
import MyCustomRequests from './pages/user/MyCustomRequests';
import ProjectDetails from './pages/user/ProjectDetails';
import Checkout from './pages/user/Checkout'; 
import MyFiles from './pages/user/MyFiles';
import UserApprovals from './pages/admin/UserApprovals';
import About from './pages/About';
import Legal from "./pages/Legal";

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProject from './pages/admin/AddProject';
import AdminCustomRequests from './pages/admin/AdminCustomRequests';
import EditProject from './pages/admin/EditProject';


function App() {
  return (
    <Router>
      <Routes>
        {/* All routes are wrapped in Layout to show Sidebar/Navbar/Footer */}
        <Route element={<Layout />}>
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          {/* User Routes */}
          <Route path="/request-custom" element={<RequestCustom />} />
          <Route path="/my-custom-requests" element={<MyCustomRequests />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-files" element={<MyFiles />} />
          <Route path="/my-projects" element={<MyFiles />} /> {/* Alias for MyFiles */}
          <Route path="/legal" element={<Legal />} />
          
          {/* Admin Routes */}
          <Route path="/admin/approvals" element={<UserApprovals />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-project" element={<AddProject />} />
          <Route path="/admin/requests" element={<AdminCustomRequests />} />
          <Route path="/admin/payments" element={<PaymentLogs />} />
          <Route path="/admin/edit-project/:id" element={<EditProject />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;