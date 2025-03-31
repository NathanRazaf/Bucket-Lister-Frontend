// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import ProtectedRoute from './components/ProtectedRoute'; // We'll create this below
import Dashboard from "./components/Dashboard.jsx";
import BucketListDetail from "./components/bucket_list_details/BucketListDetail.jsx";
import CreateBucketListForm from "./components/CreateBucketListForm.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Auth Routes */}
                <Route path="/login" element={<AuthForm />} />
                <Route path="/signup" element={<AuthForm />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bucket-list/:id"
                    element={
                    <ProtectedRoute>
                        <BucketListDetail />
                    </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-bucket-list"
                    element={
                    <ProtectedRoute>
                        <CreateBucketListForm />
                    </ProtectedRoute>
                }
                />
                {/* Catch all - 404 */}
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;