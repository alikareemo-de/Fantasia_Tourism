// Request management API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface BookingRequest {
    id: string;
    propertyId: string;
    propertyName: string;
    userId: string;
    hostId: string;
    checkInDate?: string;
    checkOutDate?: string;
    expectedArrivalTime?: string;
    numberOfGuests: number;
    additionalNotes?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    createdDate: string;
}

export const createBookingRequest = async (requestData: {
    propertyId: string;
    userId: string;
    checkInDate?: string;
    checkOutDate?: string;
    expectedArrivalTime?: string;
    numberOfGuests: number;
    additionalNotes?: string;
}): Promise<BookingRequest> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Request/AddBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create booking request: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating booking request:', error);
        throw error;
    }
};

export const fetchUserRequests = async (userId: string): Promise<BookingRequest[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/user/${userId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch user requests: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user requests:', error);
        throw error;
    }
};

export const fetchRequestsToUser = async (hostId: string): Promise<BookingRequest[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/host/${hostId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch requests to user: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching requests to user:', error);
        throw error;
    }
};

export const approveRequest = async (requestId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}/approve`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Failed to approve request: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error approving request:', error);
        throw error;
    }
};

export const rejectRequest = async (requestId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}/reject`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Failed to reject request: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error rejecting request:', error);
        throw error;
    }
};

export const cancelRequest = async (requestId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/requests/${requestId}/cancel`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Failed to cancel request: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cancelling request:', error);
        throw error;
    }
};