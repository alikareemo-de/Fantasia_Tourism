/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Map, Star, Plus } from 'lucide-react';
import { Link } from "react-router-dom";
import { useUser } from '../contexts/UserContext';

import { fetchProperties } from '@/services/propertyApi';
import PropertyImageGallery from '@/components/PropertyImageGallery';

interface PropertyImage {
    base64?: string;
    contentType?: string;
    isMain?: boolean;
}

interface Property {
    id: string;
    propertyName: string;
    type: string;
    status: string;
    city: string;
    country: string;
    pricePerNight?: number;
    images: PropertyImage[];
}

interface PropertyItemProps {
    property: Property;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ property }) => {
    return (
        <Card className="tourism-card overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto relative bg-tourism-light-blue">
                    {property.images && property.images.length > 0 ? (
                        <PropertyImageGallery images={property.images} propertyTitle={property.propertyName} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Map size={40} className="text-tourism-teal" />
                        </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/80 rounded-md px-2 py-1 flex items-center">
                        <Star className="h-4 w-4 text-tourism-sunset fill-tourism-sunset mr-1" />
                        <span className="text-sm font-medium">4.5</span>
                    </div>
                </div>

                <div className="p-4 md:p-6 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-xl text-tourism-ocean">
                                {property.propertyName}
                            </h3>
                            <div className="flex items-center mt-1 mb-2">
                                <Map className="h-4 w-4 text-gray-500 mr-1" />
                                <p className="text-sm text-gray-500">
                                    {property.city}, {property.country}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" className="p-2 hover:bg-tourism-light-blue/30">
                            <Heart className="h-5 w-5 text-tourism-coral" />
                        </Button>
                    </div>

                    <div className="flex justify-between items-end mt-auto">
                        <div>
                            <p className="text-sm text-gray-500">pricePerNight per Night</p>
                            <p className="font-bold text-lg text-tourism-ocean">
                                {property.pricePerNight ? `$${property.pricePerNight}` : 'N/A'}
                            </p>
                        </div>
                        <div className="space-x-2">
                            <Link
                                to={`/property/${property.id}`}
                                className="text-sm border-tourism-teal text-tourism-teal hover:bg-tourism-light-blue/30"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const Properties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');
    const { user } = useUser();
    useEffect(() => {
        (async () => {
            const data = await fetchProperties(user.id);
            setProperties(data ?? []);
        })();
    }, []);

    const normalized = useMemo(
        () =>
            properties.map((p) => ({
                ...p,
                status:
                    (p.status?.toLowerCase() === 'available' ? 'saved' : p.status)?.toLowerCase(),
            })),
        [properties]
    );




    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6 text-tourism-ocean">All Properties</h2>

                {properties.length === 0 ? (
                    <p className="text-gray-500">No properties found.</p>
                ) : (
                    <div className="space-y-6">
                        {properties.map((prop) => (
                            <PropertyItem key={prop.id} property={prop} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Properties;
