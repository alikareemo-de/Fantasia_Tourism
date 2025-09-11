
import axios from "axios";


export interface PropertyImage {
    Id: string;
    imageName?: string;
    base64?: string;
    contentType?: string;
    isMain?: boolean;
}
export interface Property {
    Id: string;
    UserId: string;
    PropertyName: string;
    type: string;
    description: string;
    capacity: number;
    pricePerNight: number;
    status: string;
    city: string;
    country: string;
    location: string;
    rooms: number;
    hasCar: boolean;
    tripPlan: string;
    features: string;
    images: string[];
}
export interface PropertyDto {
    id: string;
    userId: string;
    PropertyName: string;          
    description: string;   
    type: string;
    status: string;
    rooms: number;
    hasCar: boolean;
    city: string;
    tripPlan: string;
    country: string;
    location: string;       
    pricePerNight: number | null;
    capacity: number;
    images: PropertyImage[];       
    mainImage: string;
    createdDate: string;
    expireDate: Date;
    features: string[];     
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPropertyById = async (id: string): Promise<PropertyDto> => {
    try {
        const res = await fetch(
            `${API_BASE_URL}/api/properties/GetPoropertyById?Id=${encodeURIComponent(id)}`
        );

        if (!res.ok) throw new Error(`Failed to fetch property: ${res.statusText}`);

        const dto = await res.json();

       

        return {
            id: dto.id,
            userId: dto.userId,
            PropertyName: dto.propertyName,
            description: dto.description ?? '',
            type: dto.type,
            status: dto.status,
            city: dto.city,
            rooms: dto.rooms,
            hasCar: dto.hasCar,
            capacity: dto.capacity,
            tripPlan: dto.tripPlan,
            expireDate: dto.expireDate,
            country: dto.country,
            location: dto.location,
            pricePerNight: dto.pricePerNight ?? null,
            features: dto.features,
            images: dto.images
            
        };
    } catch (error) {
        console.error('Error fetching property:', error);
        throw error;
    }
};

export const fetchProperties = async (): Promise<Property[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/properties/GetAll`);
        if (!response.ok) throw new Error(`Failed to fetch properties: ${response.statusText}`);
        const data: Property[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
};

export const getLastProperties = async () => {
    const response = await fetch(`${API_BASE_URL}/api/properties/GetLastProperties`);
    if (!response.ok) throw new Error("Failed to fetch last properties");
    return response.json();
};

export const fetchPropertiesforuser = async (userId:string): Promise<Property[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/properties/GetAllUserProperties?userId=${userId}`);
        if (!response.ok) throw new Error(`Failed to fetch properties: ${response.statusText}`);
        const data: Property[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
};

export const deleteProperty = async (id: string)=> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/properties/DeletePropbyId?Id=${id}`);
        if (response.ok) return true;
        else {
            return false;
        }
    } catch (err) {
        console.error("Error deleting property:", err);
        return false;
    }
};

export const fetchPropertyImage = async (imageName: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/images/${imageName}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // Return the URL for the image
        return `${API_BASE_URL}/images/${imageName}`;
    } catch (error) {
        console.error('Error fetching image:', error);
        // Return placeholder on error
        return '/placeholder.svg';
    }
};

export const getImageUrl = (imageName: string): string => {
    return `${API_BASE_URL}${imageName}`;
};