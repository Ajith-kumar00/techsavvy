import React, { useState, useEffect } from 'react';
import '../style/Dashboard/Dashboard.css';
import { FaTachometerAlt, FaChartBar, FaCog } from 'react-icons/fa';
import PerformanceChart from './PerformanceChart';
import HeatMap from './HeatMap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.svg";

const Dashboard = () => {
  const defaultStartDate = new Date("2024-06-08");
  const defaultEndDate = new Date("2024-07-07");
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [dateRange, setDateRange] = useState({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setDateRange({
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      });
    }
  };

  const userData = JSON.parse(localStorage.getItem("userDetails"));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`d-flex ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        setSidebarOpen={setSidebarOpen}  // Pass down the state setter
      />

      {/* Main Content */}
      <div className="content flex-grow-1">
        <Header
          startDate={startDate}
          endDate={endDate}
          handleDateChange={handleDateChange}
          isUserMenuOpen={isUserMenuOpen}
          toggleUserMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
          userData={userData}
          handleLogout={handleLogout}
        />

        <main className="p-4">
          <PerformanceChart date={dateRange} />
          <HeatMap />
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar, setSidebarOpen }) => (
  <aside
    className={`sidebar ${isOpen ? 'open' : 'closed'}`}
    onMouseEnter={() => setSidebarOpen(true)}  
    onMouseLeave={() => setSidebarOpen(false)} 
  >
    <div className="logos mb-2 d-flex align-items-center justify-content-center">
      <img src={logo} alt="Tech" className="" />
    </div>
    <ul className="nav flex-column">
      <SidebarItem icon={<FaTachometerAlt />} label="Dashboard" link="/dashboard" isOpen={isOpen} />
      <SidebarItem icon={<FaChartBar />} label="Performance" link="/performance" isOpen={isOpen} />
      <SidebarItem icon={<FaCog />} label="Settings" link="/settings" isOpen={isOpen} />
    </ul>
  </aside>
);

// SidebarItem Component
const SidebarItem = ({ icon, label, link, isOpen }) => (
  <li className="nav-item mb-3">
    <a href={link} className="nav-link text-black d-flex align-items-center">
      {icon}
      {isOpen && <span className="ms-2">{label}</span>}
    </a>
  </li>
);

// Header Component
const Header = ({ startDate, endDate, handleDateChange, isUserMenuOpen, toggleUserMenu, userData, handleLogout }) => (
  <header className="topbar bg-light p-3 d-flex justify-content-between align-items-center">
    <div className="header-title">Dashboard</div>
    
    <div className="date-range-picker d-flex align-items-center">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        isClearable
        className="form-control"
        dateFormat="yyyy-MM-dd"
        placeholderText="Select Date Range"
      />
    </div>

    <div className="header-icons d-flex align-items-center position-relative">
      <i className="fas fa-expand-arrows-alt me-3"></i>
      <i className="fas fa-moon me-3"></i>
      <i className="fas fa-user" onClick={toggleUserMenu}></i>

      {isUserMenuOpen && (
        <UserMenu userData={userData} handleLogout={handleLogout} />
      )}
    </div>
  </header>
);

// UserMenu Component
const UserMenu = ({ userData, handleLogout }) => (
  <div className="user-menu-dropdown position-absolute bg-white p-4 shadow-sm rounded">
    <div className="user-info d-flex align-items-center mb-2">
      <div className="user-icon bg-primary text-white rounded-circle me-2" style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {userData?.fullName.charAt(userData?.fullName.length - 1)}
      </div>
      <div>
        <strong>{userData?.fullName}</strong>
        <div className="text-muted">Online</div>
      </div>
    </div>
    <button className="btn btn-outline-primary w-100" onClick={handleLogout}>Logout</button>
  </div>
);

export default Dashboard;
