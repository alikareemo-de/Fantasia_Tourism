/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get auth token helper
const getAuthToken = () => localStorage.getItem('authToken');

// Headers helper
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
});

// 1. Change Password API
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/settings/changepassword`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            currentPassword,
            newPassword
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
    }
};

// 2. Get Payment Info by User ID
export const getPaymentInfoByUserId = async (userId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/Account/getpaymentinfobyuserid/${userId}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get payment info');
    }

    return await response.json();
};

// 3. Update Payment Info
export const updatePayment = async (userId: string, paymentData: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/Account/updatepayment`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            userId,
            ...paymentData
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update payment info');
    }
};

// 4. Get General Settings
export const getSettings = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/Settings/getsettings`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get settings');
    }

    return await response.json();
};

// 5. Update General Settings
export const updateSettings = async (settings: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/Settings/updatesettings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update settings');
    }
};