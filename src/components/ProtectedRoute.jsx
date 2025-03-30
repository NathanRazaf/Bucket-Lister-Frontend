// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { me } from '../functions/backend/account_functions';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const response = await me(token);
                if (response.error) {
                    throw new Error(response.error);
                }
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Authentication error:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (loading) {
        // You can replace this with a loading spinner component
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;