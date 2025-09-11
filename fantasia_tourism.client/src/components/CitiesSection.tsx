import React, { useEffect, useState } from 'react';
import { Map } from "lucide-react";
import { Link } from "react-router-dom";

import { getLastProperties } from '@/services/propertyApi';
import PropertyImageGallery from '@/components/PropertyImageGallery';

interface PropertyImage {
    base64?: string;
    contentType?: string;
    isMain?: boolean;
}

interface Property {
    id: string;
    propertyName: string;
    city: string;
    country: string;
    images: PropertyImage[];
}

interface CityCardProps {
    title: string;
    count: number;
    images?: PropertyImage[];
}

const CityCard: React.FC<CityCardProps> = ({ title, count, images }) => {
    return (
        <div className="tourism-card hover-scale group">
            <div className="h-48 bg-tourism-light-blue relative overflow-hidden">
                {images && images.length > 0 ? (
                    <PropertyImageGallery images={images} propertyTitle={title} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Map size={40} className="text-tourism-teal" />
                        <div className="text-tourism-ocean/70 absolute inset-0 flex items-center justify-center">No Image</div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 text-white">
                    <h3 className="font-medium text-lg">{title}</h3>
                    <p className="text-sm text-white/80">{count} listings</p>
                </div>
            </div>
        </div>
    );
};

const CitiesSection: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertiesData = async () => {
            try {
                const data = await getLastProperties();
                setProperties(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPropertiesData();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="py-16 px-6 bg-gradient-to-b from-white to-tourism-light-blue/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <h2 className="section-heading text-tourism-ocean">√ÕœÀ «·⁄—Ê÷</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {properties.map((prop) => (
                        <CityCard
                            key={prop.id}
                            title={`${prop.propertyName} - ${prop.city}`}
                            count={prop.images?.length || 1}
                            images={prop.images}
                        />
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <Link to="/properties" className="tourism-btn">Explore All Properties</Link>
                </div>
            </div>
        </div>
    );
};

export default CitiesSection;
