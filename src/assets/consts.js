// export const BACKEND_URL = "https://bucket-lister-backend-production.up.railway.app";
export const BACKEND_URL = "http://127.0.0.1:8000";

export class ApiError extends Error {
    constructor(message, statusCode, serverMessage) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.serverMessage = serverMessage;
    }
}

export async function handleApiResponse(response) {
    if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;
        let serverMessage;

        try {
            const errorData = await response.json();
            errorMessage = errorData.detail.message;
            serverMessage = errorData.detail.error;
        } catch {
            // If parsing fails, use the status text
            errorMessage = response.statusText || errorMessage;
        }

        throw new ApiError(errorMessage, response.status, serverMessage);
    }

    return response.json();
}