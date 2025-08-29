import React, { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Map, Star, Plus } from 'lucide-react';
import AddProperty from '@/components/AddProperty';
import { Link } from "react-router-dom";

import { fetchProperties } from '@/services/propertyApi';


interface Property {
    id: string;
    propertyName: string;
    type: string;
    status: string;             
    city: string;
    country: string;
    mainImage: string;          
    price?: number;
}

interface PropertyItemProps {
    property: Property;
}

const buildImageUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = import.meta.env.VITE_API_BASE_URL ?? '';
    return `${base}${path}`;
};

const PropertyItem: React.FC<PropertyItemProps> = ({ property }) => {
    const mainImageUrl = buildImageUrl(property.mainImage);

    return (
        <Card className="tourism-card overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto relative bg-tourism-light-blue">
                    {mainImageUrl ? (
                        <img
                            src={mainImageUrl}
                            alt={property.propertyName}
                            className="w-full h-full object-cover"
                        />
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
                            <p className="text-sm text-gray-500">Price per Night</p>
                            <p className="font-bold text-lg text-tourism-ocean">
                                {property.price ? `$${property.price}` : 'N/A'}
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
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [properties, setProperties] = useState<Property[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');

    useEffect(() => {
        (async () => {
            const data = await fetchProperties();
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

    const upcomingProperties = normalized.filter((p) => p.status === 'upcoming');
    const pastProperties = normalized.filter((p) => p.status === 'past');
    const savedProperties = normalized.filter((p) => p.status === 'saved');

    useEffect(() => {
        if (upcomingProperties.length > 0) setActiveTab('upcoming');
        else if (pastProperties.length > 0) setActiveTab('past');
        else setActiveTab('saved'); 
    }, [upcomingProperties.length, pastProperties.length, savedProperties.length]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold gradient-heading">Properties</h1>
                    <Button
                        onClick={() => setShowAddProperty(!showAddProperty)}
                        className="tourism-btn flex items-center gap-2"
                    >
                        <Plus size={20} />
                        {showAddProperty ? 'Cancel' : 'Add Property'}
                    </Button>
                </div>

                {showAddProperty && (
                    <div className="mb-8">
                        <AddProperty />
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="mb-6">
                    <TabsList className="bg-tourism-light-blue/30 p-1">
                        {/*<TabsTrigger*/}
                        {/*    value="upcoming"*/}
                        {/*    className="data-[state=active]:bg-tourism-teal data-[state=active]:text-white"*/}
                        {/*>*/}
                        {/*    Upcoming*/}
                        {/*</TabsTrigger>*/}
                        {/*<TabsTrigger*/}
                        {/*    value="past"*/}
                        {/*    className="data-[state=active]:bg-tourism-teal data-[state=active]:text-white"*/}
                        {/*>*/}
                        {/*    Past Stays*/}
                        {/*</TabsTrigger>*/}
                        <TabsTrigger
                            value="saved"
                            className="data-[state=active]:bg-tourism-teal data-[state=active]:text-white"
                        >
                            All Properties
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-6 space-y-6">
                        {upcomingProperties.length === 0 ? (
                            <p className="text-gray-500">No upcoming properties.</p>
                        ) : (
                            upcomingProperties.map((prop) => <PropertyItem key={prop.id} property={prop} />)
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="mt-6 space-y-6">
                        {pastProperties.length === 0 ? (
                            <p className="text-gray-500">No past stays.</p>
                        ) : (
                            pastProperties.map((prop) => <PropertyItem key={prop.id} property={prop} />)
                        )}
                    </TabsContent>

                    <TabsContent value="saved" className="mt-6 space-y-6">
                        {savedProperties.length === 0 ? (
                       
                            properties.length === 0 ? (
                                <p className="text-gray-500">No saved properties.</p>
                            ) : (
                                normalized.map((prop) => <PropertyItem key={prop.id} property={prop} />)
                            )
                        ) : (
                            savedProperties.map((prop) => <PropertyItem key={prop.id} property={prop} />)
                        )}
                    </TabsContent>
                </Tabs>
            </main>

            <Footer />
        </div>
    );
};

export default Properties;
