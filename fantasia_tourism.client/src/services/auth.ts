/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { useUser } from '../contexts/UserContext';

interface User {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    cellPhoneNumber?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    address?: string;
    role?: string; 
}

interface RegisterData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    cellPhoneNumber?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    address?: string;
}

interface SignInData {
    username: string;
    password: string;
}

interface JwtPayload {
    sub: string;          
    unique_name: string;  
    role: string;         
    exp: number;          
    [key: string]: any;
}

let currentUser: User | null = null;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (data: RegisterData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/account/CreateUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register user');
    }

    const user: User = await response.json();
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
};

export const signInUser = async (data: SignInData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/account/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign in');
    }

    const result = await response.json(); 
    const token = result.token;

    localStorage.setItem('authToken', token);

    const decoded: JwtPayload = jwtDecode(token);

    const user: User = {
        id: decoded.sub,
        username: decoded.unique_name,
        role: decoded.role,
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;

    return user;
};

export const getCurrentUser = (): User | null => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
        const decoded: JwtPayload = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            signOutUser();
            return null;
        }

        const user: User = {
            id: decoded.sub,
            username: decoded.unique_name,
            role: decoded.role,
        };

        return user;
    } catch {
        return null;
    }
};

export const signOutUser = (): void => {
    currentUser = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
};

export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};
export const isAdmin = (): boolean => {
    const user = getCurrentUser();
    return user?.role === 'admin';
};