import {BACKEND_URL} from "../assets/consts.js";

export const login = async (email, password) => {
    const response = await fetch(`${BACKEND_URL}/api/accounts/login`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    return data
}