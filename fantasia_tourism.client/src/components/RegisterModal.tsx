import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { registerUser } from "@/services/auth";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";
import { fetchCountries, fetchCitiesByCountry, Country } from "@/services/locationApi";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignIn?: () => void;
}

const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    cellPhoneNumber: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    dateOfBirth: z.string().min(1, {
        message: "Date of birth is required.",
    }),
    country: z.string().min(1, {
        message: "Please select a country.",
    }),
    city: z.string().min(1, {
        message: "Please select a city.",
    }),
    address: z.string().min(5, {
        message: "Address must be at least 5 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToSignIn }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const { setUser } = useUser();

    // Fetch countries on component mount
    useEffect(() => {
        const loadCountries = async () => {
            setLoadingCountries(true);
            try {
                const countriesData = await fetchCountries();
                setCountries(countriesData);
            } catch (error) {
                toast.error("Failed to load countries");
            } finally {
                setLoadingCountries(false);
            }
        };

        if (isOpen) {
            loadCountries();
        }
    }, [isOpen]);

    // Fetch cities when country changes
    useEffect(() => {
        const loadCities = async () => {
            if (!selectedCountry) {
                setCities([]);
                return;
            }

            setLoadingCities(true);
            try {
                const citiesData = await fetchCitiesByCountry(selectedCountry);
                setCities(citiesData);
            } catch (error) {
                toast.error("Failed to load cities");
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        loadCities();
    }, [selectedCountry]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            firstName: "",
            lastName: "",
            cellPhoneNumber: "",
            email: "",
            dateOfBirth: "",
            country: "",
            city: "",
            address: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            const user = await registerUser({
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                cellPhoneNumber: values.cellPhoneNumber,
                dateOfBirth: values.dateOfBirth,
                country: values.country,
                city: values.city,
                address: values.address,
            });

            setUser(user);
            toast.success(`Welcome aboard, ${user.firstName}! Your account has been created.`);
            onClose();
            form.reset();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-w-[95%] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-tourism-ocean">Create an Account</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} className="h-9" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} className="h-9" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="johndoe123" {...field} className="h-9" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cellPhoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Cell Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 (555) 123-4567" {...field} className="h-9" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="johndoe@example.com" {...field} className="h-9" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="h-9" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Country</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedCountry(value);
                                                form.setValue("city", ""); // Reset city when country changes
                                            }}
                                            defaultValue={field.value}
                                            disabled={loadingCountries}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-9">
                                                    <SelectValue placeholder={loadingCountries ? "Loading countries..." : "Select country"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem key={country.code} value={country.code}>
                                                        {country.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">City</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!selectedCountry || loadingCities}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-9">
                                                    <SelectValue placeholder={
                                                        loadingCities
                                                            ? "Loading cities..."
                                                            : !selectedCountry
                                                                ? "Select country first"
                                                                : "Select city"
                                                    } />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {cities.map((city) => (
                                                    <SelectItem key={city} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St, Apt 1" {...field} className="h-9" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} className="h-9" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Confirm</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} className="h-9" />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="pt-4 gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={onClose} className="h-8 text-sm">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-tourism-ocean hover:bg-tourism-ocean/90 text-white h-8 text-sm"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register
                            </Button>
                        </DialogFooter>

                        {onSwitchToSignIn && (
                            <div className="text-center pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="text-tourism-ocean hover:text-tourism-teal p-0 h-auto font-medium"
                                        onClick={onSwitchToSignIn}
                                    >
                                        Sign In
                                    </Button>
                                </p>
                            </div>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterModal;
