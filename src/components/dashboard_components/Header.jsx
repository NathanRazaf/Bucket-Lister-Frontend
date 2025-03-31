import React, {useEffect, useRef, useState} from "react";
import {me} from "../../functions/backend/account_functions.js";
import "../../assets/styles/Header.css";
import {Link} from "react-router-dom";


const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [user, setUser] = useState({
        username: '',
        initials: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user info on component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    // Redirect to login if no token
                    window.location.href = '/login';
                    return;
                }

                const userData = await me(token);

                if (userData && userData.username) {
                    const initials = userData.username
                        .split(' ')
                        .map((name) => name[0])
                        .join('')
                        .toUpperCase();

                    setUser({username: userData.username, initials});
                } else {
                    throw new Error("Invalid user data received");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error.message || "Failed to load user data");

                // Redirect to login on authentication error
                if (error.statusCode === 401 || error.statusCode === 403) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo().then();
    }, []);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (isLoading) {
        return (
            <div className="dashboard-header">
                <h1>Bucket-Lister</h1>
                <div className="dashboard-header-buttons">
                    <div className="loading-indicator">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-header">
            <Link to={'/dashboard'} className={"dashboard-header-title"}>
                <h1>Bucket-Lister</h1>
            </Link>
            <div className="dashboard-header-buttons">
                {/* Account dropdown container */}
                <div className="account-dropdown-container" ref={dropdownRef}>
                    {/* Account button with icon and name */}
                    <button
                        className="account-button"
                        onClick={toggleDropdown}
                    >
                        <div className="account-icon">{user.initials}</div>
                        <span className="account-name">{user.username}</span>
                        <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <ul>
                                <li>
                                    <button>My Profile</button>
                                </li>
                                <li>
                                    <button>Account Settings</button>
                                </li>
                                <li>
                                    <button>Notifications</button>
                                </li>
                                <li className="divider"></li>
                                <li>
                                    <button
                                        className="logout-button"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;