import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useUser } from '@/contexts/UserContext';
import { fetchPropertyById, PropertyDto } from '@/services/propertyApi';
import { createBookingRequest } from '@/services/requestApi';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CalendarIcon, AlertTriangle, Map, ArrowLeft } from 'lucide-react';

interface BookingFormData {
    checkInDate?: Date;
    checkOutDate?: Date;
    expectedArrivalTime: string;
    numberOfGuests: number;
    additionalNotes: string;
}

const AddBook: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const [property, setProperty] = useState<PropertyDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<BookingFormData>({
        defaultValues: {
            numberOfGuests: 1,
            expectedArrivalTime: '',
            additionalNotes: ''
        }
    });

    useEffect(() => {
        const loadProperty = async () => {
            if (!id) {
                toast({
                    title: "Error",
                    description: "Property ID not found",
                    variant: "destructive"
                });
                navigate('/');
                return;
            }

            try {
                setLoading(true);
                const propertyData = await fetchPropertyById(id);
                setProperty(propertyData);
            } catch (error) {
                console.error('Error loading property:', error);
                toast({
                    title: "Error",
                    description: "Failed to load property details",
                    variant: "destructive"
                });
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        loadProperty();
    }, [id, navigate]);

    // Check authentication
    useEffect(() => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to make a booking request",
                variant: "destructive"
            });
            navigate('/');
        }
    }, [user, navigate]);

    const onSubmit = async (data: BookingFormData) => {
        if (!user || !property) return;

        // Validate property availability
        if (property.status !== 'available') {
            toast({
                title: "Property Unavailable",
                description: "This property is currently not available for booking",
                variant: "destructive"
            });
            return;
        }

        // Validate expiration date
        if (property.expireDate) {
            const expireDate = new Date(property.expireDate);
            if (data.checkInDate && data.checkInDate > expireDate) {
                toast({
                    title: "Invalid Date",
                    description: "Check-in date cannot be after the property's expiration date",
                    variant: "destructive"
                });
                return;
            }
            if (data.checkOutDate && data.checkOutDate > expireDate) {
                toast({
                    title: "Invalid Date",
                    description: "Check-out date cannot be after the property's expiration date",
                    variant: "destructive"
                });
                return;
            }
        }

        // Validate capacity
        if (data.numberOfGuests > (property.capacity || 0)) {
            toast({
                title: "Capacity Exceeded",
                description: `This property can accommodate maximum ${property.capacity} guests`,
                variant: "destructive"
            });
            return;
        }

        try {
            setSubmitting(true);

            await createBookingRequest({
                propertyId: property.id,
                userId: user.id,
                checkInDate: data.checkInDate?.toISOString(),
                checkOutDate: data.checkOutDate?.toISOString(),
                expectedArrivalTime: data.expectedArrivalTime || undefined,
                numberOfGuests: data.numberOfGuests,
                additionalNotes: data.additionalNotes || undefined
            });

            toast({
                title: "Success!",
                description: "Your booking request has been sent successfully. The host will review and respond soon.",
            });

            // Navigate to requests page
            navigate('/requests');
        } catch (error) {
            console.error('Error creating booking request:', error);
            toast({
                title: "Error",
                description: "Failed to send booking request. Please try again.",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getExpirationWarning = () => {
        if (!property?.expireDate) return null;

        const expireDate = new Date(property.expireDate);
        const now = new Date();
        const timeDiff = expireDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 0) {
            return (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        This property listing has expired and is no longer available for booking.
                    </AlertDescription>
                </Alert>
            );
        }

        if (daysDiff <= 7) {
            return (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Warning: This property listing will expire on {format(expireDate, 'PPP')} ({daysDiff} days remaining).
                    </AlertDescription>
                </Alert>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading property details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!property || !user) {
        return null;
    }

    const isPropertyAvailable = property.status === 'available';

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow bg-background py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Button
                        variant="outline"
                        className="mb-6"
                        onClick={() => navigate(`/property/${property.id}`)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Property
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Property Summary */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Property Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {property.images && property.images.length > 0 && (
                                        <img
                                            src={"data:image/;base64,"+property.images[0].base64}
                                            alt={property.PropertyName}
                                            className="w-full h-32 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder.svg';
                                            }}
                                        />
                                    )}
                                   

                                    <div>
                                        <h3 className="font-semibold">{property.PropertyName || property.PropertyName}</h3>
                                        <p className="text-sm text-muted-foreground">{property.location}</p>
                                        <p className="text-sm text-muted-foreground">{property.city}, {property.country}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="font-medium">Capacity:</span> {property.capacity} guests
                                        </div>
                                        <div>
                                            <span className="font-medium">Rooms:</span> {property.rooms}
                                        </div>
                                        <div>
                                            <span className="font-medium">Price:</span> ${property.price}/night
                                        </div>
                                        <div>
                                            <span className="font-medium">Status:</span>
                                            <span className={`ml-1 ${isPropertyAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                                {property.status}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Booking Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Book This Property</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {getExpirationWarning()}

                                    {!isPropertyAvailable && (
                                        <Alert variant="destructive" className="mb-6">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription>
                                                This property is currently not available for booking (Status: {property.status}).
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Check-in Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="checkInDate">Check-in Date (Optional)</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !watch('checkInDate') && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {watch('checkInDate') ? format(watch('checkInDate')!, "PPP") : "Select check-in date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={watch('checkInDate')}
                                                        onSelect={(date) => setValue('checkInDate', date)}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                        className={cn("p-3 pointer-events-auto")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <p className="text-sm text-muted-foreground">
                                                You can leave this empty to set later after approval
                                            </p>
                                        </div>

                                        {/* Check-out Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="checkOutDate">Check-out Date (Optional)</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !watch('checkOutDate') && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {watch('checkOutDate') ? format(watch('checkOutDate')!, "PPP") : "Select check-out date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={watch('checkOutDate')}
                                                        onSelect={(date) => setValue('checkOutDate', date)}
                                                        disabled={(date) => date < new Date() || (watch('checkInDate') && date <= watch('checkInDate')!)}
                                                        initialFocus
                                                        className={cn("p-3 pointer-events-auto")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <p className="text-sm text-muted-foreground">
                                                You can leave this empty to set later after approval
                                            </p>
                                        </div>

                                        {/* Expected Arrival Time */}
                                        <div className="space-y-2">
                                            <Label htmlFor="expectedArrivalTime">Expected Arrival Time (Optional)</Label>
                                            <Input
                                                id="expectedArrivalTime"
                                                type="time"
                                                {...register('expectedArrivalTime')}
                                                placeholder="e.g., 15:00"
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                You can leave this empty to set later after approval
                                            </p>
                                        </div>

                                        {/* Number of Guests */}
                                        <div className="space-y-2">
                                            <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                                            <Input
                                                id="numberOfGuests"
                                                type="number"
                                                min="1"
                                                max={property.capacity || 10}
                                                {...register('numberOfGuests', {
                                                    required: 'Number of guests is required',
                                                    valueAsNumber: true,
                                                    min: { value: 1, message: 'At least 1 guest is required' },
                                                    max: { value: property.capacity || 10, message: `Maximum ${property.capacity} guests allowed` }
                                                })}
                                            />
                                            {errors.numberOfGuests && (
                                                <p className="text-sm text-destructive">{errors.numberOfGuests.message}</p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                Maximum capacity: {property.capacity} guests
                                            </p>
                                        </div>

                                        {/* Additional Notes */}
                                        <div className="space-y-2">
                                            <Label htmlFor="additionalNotes">Additional Notes/Requirements (Optional)</Label>
                                            <Textarea
                                                id="additionalNotes"
                                                {...register('additionalNotes')}
                                                placeholder="Any special requests, dietary requirements, accessibility needs, etc."
                                                className="min-h-[100px]"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={submitting || !isPropertyAvailable}
                                        >
                                            {submitting ? 'Sending Request...' : 'Send Booking Request'}
                                        </Button>

                                        {!isPropertyAvailable && (
                                            <p className="text-sm text-center text-muted-foreground">
                                                Booking is disabled as this property is currently {property.status}
                                            </p>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AddBook;