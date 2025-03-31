import {ApiError, BACKEND_URL} from "../../assets/consts.js";

export const createBucketItem = async (token, bucket_list_id, content) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${bucket_list_id}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        })
        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const getBucketItems = async (token, bucket_list_id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${bucket_list_id}/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const updateBucketItem = async (token, bucket_list_id, item_id, content, is_completed) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${bucket_list_id}/items/${item_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content, is_completed }),
        })
        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const deleteBucketItem = async (token, bucket_list_id, item_id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${bucket_list_id}/items/${item_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.detail || "Failed to delete item", response.status);
        }

        // For 204 responses, return success without trying to parse JSON
        if (response.status === 204) {
            return { success: true };
        }

        // Only try to parse JSON for responses that aren't 204
        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const toggleBucketItem = async (token, bucket_list_id, item_id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${bucket_list_id}/items/${item_id}/toggle`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}