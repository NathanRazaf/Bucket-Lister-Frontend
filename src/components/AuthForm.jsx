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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
        // Update the URL when toggling between login and signup
        navigate(isLogin ? '/signup' : '/login', { replace: true });
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
                localStorage.setItem('token', response.token);
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
                localStorage.setItem('token', response.token);
                // Redirect to dashboard or home page
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {isLogin ? (
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
                    ) : (
                        <>
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
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {!isLogin && (
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
                    )}

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-toggle">
                    <p>
                        {isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button type="button" onClick={toggleAuthMode} className="toggle-link">
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;