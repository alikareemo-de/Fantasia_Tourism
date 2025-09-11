import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { X, Upload, Eye, CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const API_BASE = import.meta.env.VITE_API_BASE_URL;


enum PropertyType {
    Apartment = 1,
    House = 2,
    Villa = 3
}
interface PropertyFormData {
    Id: string;
    UserId: string;
    PropertyName: string;
    type: number;
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
    expireDate: Date;
    features: string[];
}

interface ImageFile extends File {
    meta: { propertyId: any; imageName: string; isMain: boolean; imageUrl: string; };
    preview: string;
    originalName: string;
    isMain?: boolean;
}


const AddProperty: React.FC = () => {
    const { user } = useUser();
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const availableFeatures = [
        'Wi-Fi', 'Parking', 'Pool', 'Gym', 'Air Conditioning', 'Heating',
        'Kitchen', 'Laundry', 'Balcony', 'Garden', 'Pets Allowed', 'Smoking Allowed',
        'Wheelchair Accessible', 'Elevator', 'Security', 'Concierge'
    ];
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<PropertyFormData>({
        defaultValues: { hasCar: false ,features: []}
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
            originalName: file.name
        })) as ImageFile[];

        setImages(prev => [...prev, ...newImages]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
        multiple: true
    });

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const setMainImage = (index: number) => {
        setImages(prev =>
            prev.map((img, i) => {
                if (i === index) {
                    (img as any).isMain = true;
                } else {
                    (img as any).isMain = false;
                }
                return img;
            })
        );
    };

    // helper to convert File -> base64 string (strip data URL prefix)
    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = (e) => reject(e);
            reader.onload = () => {
                const result = reader.result as string; // "data:image/png;base64,...."
                const base64 = result.split(",")[1]; // take the part after comma
                resolve(base64);
            };
            reader.readAsDataURL(file);
        });

    const onSubmit = async (data: PropertyFormData) => {
        if (!user) {
            toast({ title: "Error", description: "Login required", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            // ensure user id is present
            data.UserId = user.id;
                       // build images payload (Base64)
            const imagesPayload = await Promise.all(
                images.map(async (image) => {
                    const origName = image.originalName || image.name;
                    const ext = (origName.split(".").pop() || "").replace(/[^a-zA-Z0-9]/g, "");
                    const imageName = `${data.PropertyName.replace(/\s+/g, "_")}${image.isMain ? "-main" : ""}-${Date.now()}.${ext || "jpg"}`;

                    const base64 = await fileToBase64(image); // base64 WITHOUT prefix
                    return {
                        imageName,
                        contentType: image.type || `image/${ext || "jpeg"}`,
                        isMain: !!image.isMain,
                        base64 // IMPORTANT: this is the raw base64 string (no "data:...,")
                    };
                })
            );

            // final payload: all property fields + images array
            const payload = {
                ...data,
                features: selectedFeatures.join(','),
                Images: imagesPayload // matches C# ImageUploadDto list
            };

            // send JSON body (single API call)
            const res = await axios.post(`${API_BASE}/api/Properties/Addproperties`, payload, {
                headers: { "Content-Type": "application/json" },
                // optional: increase timeout for large uploads
                timeout: 120000
            });

            toast({ title: "Success", description: "Property added successfully" });
            reset();
            setImages([]);
            setSelectedFeatures([]);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.response?.data?.message || err.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };




    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Add New Property</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Property Type *</Label>
                            <Select onValueChange={(value) => setValue('type', value, { shouldValidate: true })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={PropertyType.Apartment.toString()}>Apartment</SelectItem>
                                    <SelectItem value={PropertyType.House.toString()}>House</SelectItem>
                                    <SelectItem value={PropertyType.Villa.toString()}>Villa</SelectItem>
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register('type', { required: 'Property type is required' })} />
                            {errors.type && <p className="text-sm text-destructive">Property type is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="propertyName">Property Name *</Label>
                            <Input
                                id="propertyName"
                                placeholder="Enter property name"
                                {...register('PropertyName', { required: 'Property name is required' })}
                            />
                            {errors.PropertyName && <p className="text-sm text-destructive">{errors.PropertyName.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your property..."
                                className="min-h-[100px]"
                                {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                        </div>

                        {/* Grid for numeric fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity *</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min="1"
                                    {...register('capacity', {
                                        required: 'Capacity is required',
                                        valueAsNumber: true,
                                        min: { value: 1, message: 'Capacity must be at least 1' }
                                    })}
                                />
                                {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pricePerNight">pricePerNight Per Night *</Label>
                                <Input
                                    id="pricePerNight"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    {...register('pricePerNight', {
                                        required: 'pricePerNight is required',
                                        valueAsNumber: true,
                                        min: { value: 0, message: 'pricePerNight must be positive' }
                                    })}
                                />
                                {errors.pricePerNight && <p className="text-sm text-destructive">{errors.pricePerNight.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rooms">Rooms *</Label>
                                <Input
                                    id="rooms"
                                    type="number"
                                    min="1"
                                    {...register('rooms', {
                                        required: 'Number of rooms is required',
                                        valueAsNumber: true,
                                        min: { value: 1, message: 'Must have at least 1 room' }
                                    })}
                                />
                                {errors.rooms && <p className="text-sm text-destructive">{errors.rooms.message}</p>}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select onValueChange={(value) => setValue('status', value, { shouldValidate: true })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select availability status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register('status', { required: 'Status is required' })} />
                            {errors.status && <p className="text-sm text-destructive">Status is required</p>}
                        </div>

                        {/* Location fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    {...register('city', { required: 'City is required' })}
                                />
                                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                    id="country"
                                    {...register('country', { required: 'Country is required' })}
                                />
                                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                placeholder="Full address or location description"
                                {...register('location', { required: 'Location is required' })}
                            />
                            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                        </div>

                        {/* Has Car checkbox */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="hasCar"
                                checked={watch('hasCar')}
                                onCheckedChange={(checked) => setValue('hasCar', !!checked)}
                            />
                            <Label htmlFor="hasCar">Car available for guests</Label>
                        </div>

                        {/* Trip Plan */}
                        <div className="space-y-2">
                            <Label htmlFor="tripPlan">Trip Plan</Label>
                            <Textarea
                                id="tripPlan"
                                placeholder="Describe available activities, attractions, or trip recommendations..."
                                className="min-h-[100px]"
                                {...register('tripPlan')}
                            />
                        </div>
                        {/* Expire Date */}
                        <div className="space-y-2">
                            <Label htmlFor="expireDate">Expire Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !watch('expireDate') && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {watch('expireDate') ? format(watch('expireDate'), "PPP") : "Select expire date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={watch('expireDate')}
                                        onSelect={(date) => setValue('expireDate', date!, { shouldValidate: true })}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                        className={cn("p-3 pointer-events-auto")}
                                    />
                                </PopoverContent>
                            </Popover>
                            <input type="hidden" {...register('expireDate', { required: 'Expire date is required' })} />
                            {errors.expireDate && <p className="text-sm text-destructive">Expire date is required</p>}
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                            <Label htmlFor="features">Features</Label>
                            <Select onValueChange={(value) => {
                                if (!selectedFeatures.includes(value)) {
                                    const newFeatures = [...selectedFeatures, value];
                                    setSelectedFeatures(newFeatures);
                                    setValue('features', newFeatures);
                                }
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select features" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableFeatures.filter(feature => !selectedFeatures.includes(feature)).map((feature) => (
                                        <SelectItem key={feature} value={feature}>{feature}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Selected Features Display */}
                            {selectedFeatures.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedFeatures.map((feature, index) => (
                                        <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            {feature}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFeatures = selectedFeatures.filter((_, i) => i !== index);
                                                    setSelectedFeatures(newFeatures);
                                                    setValue('features', newFeatures);
                                                }}
                                                className="text-primary hover:text-primary/70"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Image Upload */}
                        <div className="space-y-4">
                            <Label>Property Images</Label>
                            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
                                <input {...getInputProps()} />
                                <Upload className="mx-auto h-12 w-12 mb-4" />
                                {isDragActive ? <p>Drop images...</p> : <p>Drag & drop or click</p>}
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img src={image.preview} className="w-full h-32 object-cover rounded" />
                                            <div className="absolute top-1 left-1 flex gap-1">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={image.isMain ? "default" : "secondary"}
                                                    onClick={() => setMainImage(index)}
                                                >
                                                    {image.isMain ? "Main" : "Set Main"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding Property...' : 'Add Property'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddProperty;