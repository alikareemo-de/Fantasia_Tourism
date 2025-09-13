const API_BASE_URL = '/api';

// User Management Types
export interface AdminUser {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    cellPhoneNumber?: string;
    country?: string;
    city?: string;
    isBlocked: boolean;
    createdDate: string;
}

// Property Management Types
export interface AdminProperty {
    id: string;
    title: string;
    location: string;
    price: number;
    description: string;
    userId: string;
    status: string;
    city?: string;
    country?: string;
    capacity?: number;
    rooms?: number;
    createdDate?: string;
    expireDate?: Date;
}

// Users Management API
export const fetchAllUsers = async (): Promise<AdminUser[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const blockUser = async (userId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Failed to block user: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error blocking user:', error);
        throw error;
    }
};

export const unblockUser = async (userId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unblock`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Failed to unblock user: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error unblocking user:', error);
        throw error;
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Requests Management API
export const fetchAllRequests = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/requests`);

        if (!response.ok) {
            throw new Error(`Failed to fetch requests: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching requests:', error);
        throw error;
    }
};

export const deleteRequest = async (requestId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/requests/${requestId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete request: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
    }
};

// Properties Management API
export const fetchAllProperties = async (): Promise<AdminProperty[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/properties`);

        if (!response.ok) {
            throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete property: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error deleting property:', error);
        throw error;
    }
};

export const deactivateProperty = async (propertyId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}/deactivate`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Failed to deactivate property: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error deactivating property:', error);
        throw error;
    }
};

export const rejectProperty = async (propertyId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}/reject`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Failed to reject property: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error rejecting property:', error);
        throw error;
    }
};