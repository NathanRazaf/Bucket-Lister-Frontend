import {ApiError, BACKEND_URL} from "../../assets/consts.js";

export const createBucketList = async (token, title, description) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description }),
        })
        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const getMyBucketLists = async (token) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists`, {
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

export const getCollabBucketLists = async (token) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/collaborated`, {
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

export const getBucketList = async (token, id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${id}`, {
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

export const updateBucketList = async (token, id, title, description, is_private) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, is_private }),
        })
        return await response.json()
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("An unexpected error occurred", 500, error.message);
    }
}

export const deleteBucketList = async (token, id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${id}`, {
            method: 'DELETE',
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

export const shareBucketList = async (token, id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${id}/share`, {
            method: 'POST',
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

export const unshareBucketList = async (token, id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${id}/share`, {
            method: 'DELETE',
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

export const getSharedBucketList = async (sharedToken) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/shared/${sharedToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

export const getBucketListCollaborators = async (token, id) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/bucket-lists/${id}/collaborators`, {
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