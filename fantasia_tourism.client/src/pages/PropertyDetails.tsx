import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import { fetchPropertyById, PropertyDto } from '@/services/propertyApi';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { ArrowLeft, Heart, MapPin, Loader2, Edit, Save, X, Upload, Trash2, Star, CalendarIcon } from "lucide-react";
import axios from "axios";
/** ==== Types that match your API shape (images as base64) ==== */
export interface PropertyImage {
    imageName?: string;
    base64?: string;
    contentType?: string;
    isMain?: boolean;
}

enum PropertyType {
    Apartment = 1,
    House = 2,
    Villa = 3
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const availableFeatures = [
    'Wi-Fi', 'Parking', 'Pool', 'Gym', 'Air Conditioning', 'Heating',
    'Kitchen', 'Laundry', 'Balcony', 'Garden', 'Pets Allowed', 'Smoking Allowed',
    'Wheelchair Accessible', 'Elevator', 'Security', 'Concierge'
];
const toDataUrl = (img?: PropertyImage) => {
    if (!img) return '/placeholder.svg';
    if (img.base64) {
        const ct = img.contentType || 'image/*';
        return `data:${ct};base64,${img.base64}`;
    }
    if (img.imageName && img.imageName.startsWith('/')) {
        const base = API_BASE_URL ?? '';
        return `${base}${img.imageName}`;
    }
    return '/placeholder.svg';
};


const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const b64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(b64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

/** ================= Component ================= */
const PropertyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUser();

    const [property, setProperty] = useState<PropertyDto | null>(null);
    const [editedProperty, setEditedProperty] = useState<PropertyDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);



    /** Load property */
    useEffect(() => {
        (async () => {
            if (!id) {
                setError('Property ID not found');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await fetchPropertyById(id);
                const safe: PropertyDto = {
                    ...data,
                    features: data.features ?? [],
                    images: data.images ?? [],
                };
                setProperty(safe);
                setEditedProperty(safe);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load property');
                setProperty(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);


    const isOwner = !!(user && property && user.id === property.userId);

    const toggleFavorite = () => setIsFavorite((v) => !v);
    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        setEditedProperty(property);
    };

    const handleInputChange = (field: keyof PropertyDto, value: any) => {
        if (!editedProperty) return;
        setEditedProperty({ ...editedProperty, [field]: value });
    };

    /** ============ Images (edit-mode) ============ */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedProperty || !e.target.files) return;
        const files = Array.from(e.target.files);

        const newImgs: PropertyImage[] = await Promise.all(
            files.map(async (f) => ({

                imageName: f.name,
                contentType: f.type || 'image/jpeg',
                base64: await fileToBase64(f),
                isMain: false,
            }))
        );

        setEditedProperty({
            ...editedProperty,
            images: [...(editedProperty.images ?? []), ...newImgs],
        });
        // reset input
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        if (!editedProperty) return;
        const imgs = [...(editedProperty.images ?? [])];
        imgs.splice(index, 1);
        setEditedProperty({ ...editedProperty, images: imgs });
    };

    const setMainImage = (index: number) => {
        if (!editedProperty) return;
        const imgs = [...(editedProperty.images ?? [])];
        const [main] = imgs.splice(index, 1);
        imgs.unshift(main);
        setEditedProperty({ ...editedProperty, images: imgs });
    };

    /** ============ Features (edit-mode) ============ */
    const addFeature = () => {
        if (!editedProperty) return;
        setEditedProperty({ ...editedProperty, features: [...(editedProperty.features ?? []), ''] });
    };

    const updateFeature = (i: number, v: string) => {
        if (!editedProperty) return;
        const list = [...(editedProperty.features ?? [])];
        list[i] = v;
        setEditedProperty({ ...editedProperty, features: list });
    };

    const removeFeature = (i: number) => {
        if (!editedProperty) return;
        const list = (editedProperty.features ?? []).filter((_, idx) => idx !== i);
        setEditedProperty({ ...editedProperty, features: list });
    };

    /** Save (JSON body exactly like add: property + images(base64)) */
    const handleSave = async () => {
        if (!editedProperty) return;

        try {
            setSaving(true);

            const images: PropertyImage[] = (editedProperty.images ?? []).map((img, idx) => ({
                imageName: img.imageName,
                base64: img.base64,
                contentType: img.contentType,
                isMain: idx === 0,
            }));

            editedProperty.features = (editedProperty.features || [])
                .filter((f: string) => f && f.trim() !== "");
            const payload: PropertyDto = {
                ...editedProperty,
                images,
            };

            await axios.post(
                `${API_BASE_URL}/api/Properties/Editproperties`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            // Reload to reflect changes
            const fresh = await fetchPropertyById(editedProperty.id);
            const safe: PropertyDto = {
                ...fresh,
                images: fresh.images ?? [],
            };
            setProperty(safe);
            setEditedProperty(safe);
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving property', err);
            alert('Failed to save property. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    /** ====== Loading / Error ====== */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800">Loading property...</h2>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            {error || 'Property Not Found'}
                        </h2>
                        <Button onClick={() => navigate('/')}>Back to Home</Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <div className="flex-grow bg-[#f9f7f3]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Button
                        variant="outline"
                        className="mb-6 border-[#6b7d65] text-[#6b7d65] hover:bg-[#f2f4ef]"
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: images */}
                        <div className="lg:col-span-2">
                            {isEditing && isOwner ? (
                                <div className="space-y-4 mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-800">Property Images</h2>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {(editedProperty?.images ?? []).map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={toDataUrl(img)}
                                                    alt={`Property image ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                                                />
                                                {index === 0 && (
                                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Main
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                    <div className="flex space-x-2">
                                                        {index !== 0 && (
                                                            <Button size="sm" variant="secondary" onClick={() => setMainImage(index)} className="text-xs">
                                                                <Star className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="destructive" onClick={() => removeImage(index)}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add new image */}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                                            >
                                                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-500">Add Images</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <PropertyImageGallery
                                    images={property.images ?? []}
                                    propertyTitle={property.PropertyName}
                                />
                            )}

                            {/* Description */}
                            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
                                {isEditing ? (
                                    <Textarea
                                        value={editedProperty?.description ?? ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full min-h-[100px]"
                                        placeholder="Property description..."
                                    />
                                ) : (
                                    <p className="text-gray-600">{property.description}</p>
                                )}
                            </div>
                            {/* Trip Plan */}
                            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Plan</h2>
                                {isEditing ? (
                                    <Textarea
                                        value={editedProperty?.tripPlan ?? ''}
                                        onChange={(e) => handleInputChange('tripPlan', e.target.value)}
                                        className="w-full min-h-[100px]"
                                        placeholder="Trip plan details..."
                                    />
                                ) : (
                                    <p className="text-gray-600">{property.tripPlan}</p>
                                )}
                            </div>
                            {/* Features */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
                                {isEditing && editedProperty ? (
                                    <div className="space-y-3">
                                        {editedProperty.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    value={feature}
                                                    onChange={(e) => updateFeature(index, e.target.value)}
                                                    placeholder="Feature name..."
                                                    className="flex-1"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeFeature(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            onClick={addFeature}
                                            className="w-full"
                                        >
                                            Add Feature
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {property.features.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-2 h-2 bg-[#6b7d65] rounded-full mr-2"></div>
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right column - Property details */}
                        <div>
                            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    {isEditing && editedProperty ? (
                                        <Input
                                            value={editedProperty.PropertyName}
                                            onChange={(e) => handleInputChange('PropertyName', e.target.value)}
                                            className="text-2xl font-bold flex-1 mr-4"
                                            placeholder="Property title..."
                                        />
                                    ) : (
                                        <h1 className="text-2xl font-bold text-gray-800">{property.PropertyName}</h1>
                                    )}
                                    {!isOwner && (
                                        <button
                                            onClick={toggleFavorite}
                                            className="p-2 rounded-full hover:bg-gray-100"
                                        >
                                            <Heart
                                                className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                                            />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center mb-4 text-gray-600">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {isEditing && editedProperty ? (
                                        <Input
                                            value={editedProperty.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            placeholder="Property location..."
                                            className="flex-1"
                                        />
                                    ) : (
                                        <span>{property.location}</span>
                                    )}
                                </div>

                                {/* Property Type */}
                                {(property.type || (isEditing && editedProperty)) && (
                                    <div className="mb-4">
                                        <span className="text-gray-600 block mb-2">Property Type</span>
                                        {isEditing && editedProperty ? (
                                            <Select
                                                value={editedProperty.type?.toString() || ''}
                                                onValueChange={(value) => handleInputChange('type', Number(value))}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select property type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={PropertyType.Apartment.toString()}>Apartment</SelectItem>
                                                    <SelectItem value={PropertyType.House.toString()}>House</SelectItem>
                                                    <SelectItem value={PropertyType.Villa.toString()}>Villa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span className="text-gray-800">
                                                {property.type === PropertyType.Apartment && 'Apartment'}
                                                {property.type === PropertyType.House && 'House'}
                                                {property.type === PropertyType.Villa && 'Villa'}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {/* Status */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">Status</span>
                                    {isEditing && editedProperty ? (
                                        <Select
                                            value={editedProperty.status || ''}
                                            onValueChange={(value) => handleInputChange('status', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="booked">Booked</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <span className="text-gray-800">{property.status || 'Not specified'}</span>
                                    )}
                                </div>

                                {/* City */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">City</span>
                                    {isEditing && editedProperty ? (
                                        <Input
                                            value={editedProperty.city || ''}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="City..."
                                            className="w-full"
                                        />
                                    ) : (
                                        <span className="text-gray-800">{property.city || 'Not specified'}</span>
                                    )}
                                </div>

                                {/* Country */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">Country</span>
                                    {isEditing && editedProperty ? (
                                        <Input
                                            value={editedProperty.country || ''}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            placeholder="Country..."
                                            className="w-full"
                                        />
                                    ) : (
                                        <span className="text-gray-800">{property.country || 'Not specified'}</span>
                                    )}
                                </div>

                                {/* Capacity */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">Capacity (guests)</span>
                                    {isEditing && editedProperty ? (
                                        <Input
                                            type="number"
                                            value={editedProperty.capacity || ''}
                                            onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                                            placeholder="Number of guests..."
                                            className="w-full"
                                            min="1"
                                        />
                                    ) : (
                                        <span className="text-gray-800">{property.capacity ? `${property.capacity} guests` : 'Not specified'}</span>
                                    )}
                                </div>

                                {/* Rooms */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">Number of Rooms</span>
                                    {isEditing && editedProperty ? (
                                        <Input
                                            type="number"
                                            value={editedProperty.rooms || ''}
                                            onChange={(e) => handleInputChange('rooms', Number(e.target.value))}
                                            placeholder="Number of rooms..."
                                            className="w-full"
                                            min="1"
                                        />
                                    ) : (
                                        <span className="text-gray-800">{property.rooms ? `${property.rooms} rooms` : 'Not specified'}</span>
                                    )}
                                </div>

                                {/* Has Car */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">Car Available</span>
                                    {isEditing && editedProperty ? (
                                        <Select
                                            value={editedProperty.hasCar?.toString() || ''}
                                            onValueChange={(value) => handleInputChange('hasCar', value === 'true')}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Car availability" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Yes</SelectItem>
                                                <SelectItem value="false">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <span className="text-gray-800">{property.hasCar ? 'Yes' : 'No'}</span>
                                    )}
                                </div>



                                {/* Expire Date */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">Expire Date</span>
                                    {isEditing && editedProperty ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !editedProperty.expireDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {editedProperty.expireDate ? format(editedProperty.expireDate, "PPP") : "Select expire date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={editedProperty.expireDate}
                                                    onSelect={(date) => handleInputChange('expireDate', date)}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                    className={cn("p-3 pointer-events-auto")}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <span className="text-gray-800">
                                            {property.expireDate ? format(new Date(property.expireDate), "PPP") : 'Not set'}
                                        </span>
                                    )}
                                </div>

                                {/* Created Date */}
                                <div className="mb-4">
                                    <span className="text-gray-600 block mb-2">Created Date</span>
                                    <span className="text-gray-800">
                                        {property.createdDate ? format(new Date(property.createdDate), "PPP") : 'Not available'}
                                    </span>
                                </div>
                                <div className="border-t border-b border-gray-200 py-4 my-4">
                                    <div className="mb-2">
                                        <span className="text-gray-600">pricePerNight per night</span>
                                    </div>
                                    {isEditing && editedProperty ? (
                                        <div className="flex items-center">
                                            <span className="text-3xl font-bold text-[#6b7d65] mr-2">$</span>
                                            <Input
                                                type="number"
                                                value={editedProperty.pricePerNight}
                                                onChange={(e) => handleInputChange('pricePerNight', Number(e.target.value))}
                                                className="text-2xl font-bold w-32"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-3xl font-bold text-[#6b7d65]">${property.pricePerNight}</div>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full bg-[#6b7d65] hover:bg-[#5a6b55]"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            className="w-full border-[#6b7d65] text-[#6b7d65] hover:bg-[#f2f4ef]"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                ) : isOwner ? (
                                    <Button
                                        onClick={handleEdit}
                                        className="w-full bg-[#6b7d65] hover:bg-[#5a6b55]"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Property
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full bg-[#6b7d65] hover:bg-[#5a6b55] disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={property.status !== 'available'}
                                        onClick={() => navigate(`/add-book/${property.id}`)}
                                    >
                                        {property.status === 'available' ? 'Book Now' : `Unavailable (${property.status})`}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PropertyDetails;
