
interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    cellPhoneNumber?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    address?: string;
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


let currentUser: User | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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



export interface SignInResponse {
    user: User;
    token: string;  
}

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

    const result: SignInResponse = await response.json();

    localStorage.setItem('authToken', result.token);

    localStorage.setItem('currentUser', JSON.stringify(result.user));

    currentUser = result.user;

    return result.user;
};



export const getCurrentUser = (): User | null => {
  if (currentUser) {
    return currentUser;
  }
  
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    return currentUser;
  }
  
  return null;
};

export const signOutUser = (): void => {
  currentUser = null;
  localStorage.removeItem("currentUser");
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
