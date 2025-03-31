// AuthForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register } from '../functions/backend/account_functions';
import '../assets/styles/AuthForm.css';

const AuthForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        email_or_username: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const toggleAuthMode = () => {
        // Set transitioning state to prevent both forms showing at once
        setIsTransitioning(true);

        // Use a timeout to delay the state change, ensuring the previous form is unmounted
        setTimeout(() => {
            setIsLogin(!isLogin);
            setError('');
            // Update the URL when toggling between login and signup
            navigate(isLogin ? '/signup' : '/login', { replace: true });

            // Another timeout to complete the transition
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 50);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login logic
                if (!formData.email_or_username || !formData.password) {
                    throw new Error('Please fill in all fields');
                }

                const response = await login(formData.email_or_username, formData.password);

                if (response.error) {
                    throw new Error(response.error);
                }

                // Store token in localStorage
                localStorage.setItem('token', response.access_token);
                // Redirect to dashboard or home page
                navigate('/dashboard');
            } else {
                // Signup logic
                if (!formData.email || !formData.username || !formData.password) {
                    throw new Error('Please fill in all fields');
                }

                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                const response = await register(formData.email, formData.username, formData.password);

                if (response.error) {
                    throw new Error(response.error);
                }

                // Store token in localStorage
                localStorage.setItem('token', response.access_token);
                // Redirect to dashboard or home page
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => {
        // During transition, don't render any form
        if (isTransitioning) {
            return null;
        }

        if (isLogin) {
            return (
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email_or_username">Email or Username</label>
                        <input
                            type="text"
                            id="email_or_username"
                            name="email_or_username"
                            value={formData.email_or_username}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email or username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Processing...' : 'Login'}
                    </button>
                </form>
            );
        } else {
            return (
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            placeholder="Choose a username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            type="password"
                            id="signup-password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h2>Bucket-Lister</h2>

                {error && <div className="error-message">{error}</div>}

                {/* Form container with dynamic content */}
                <div className="form-wrapper">
                    {renderForm()}
                </div>

                <div className="auth-toggle">
                    <p>
                        {isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button
                            type="button"
                            onClick={toggleAuthMode}
                            className="toggle-link"
                            disabled={isTransitioning}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;