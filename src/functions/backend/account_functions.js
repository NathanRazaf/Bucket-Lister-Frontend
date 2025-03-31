import {ApiError, BACKEND_URL} from "../../assets/consts.js";

export const login = async (email_or_username, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/accounts/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email_or_username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // If response isn't in the 200-299 range
            throw new ApiError(
                data.detail || "Login failed",
                response.status
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const register = async (email, username, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/accounts/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // If response isn't in the 200-299 range
            throw new ApiError(
                data.detail || "Registration failed",
                response.status
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const me = async (token) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/accounts/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        const data = await response.json();

        if (!response.ok) {
            // If response isn't in the 200-299 range
            throw new ApiError(
                data.detail || "Failed to get user data",
                response.status
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const updateAccount = async (token, email, username, password) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/accounts/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email, username, password }),
        })

        const data = await response.json();

        if (!response.ok) {
            // If response isn't in the 200-299 range
            throw new ApiError(
                data.detail || "Failed to update account",
                response.status
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}