import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Mail, Phone, Calendar, Edit, Save, X } from 'lucide-react';



interface UserProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    cellPhoneNumber?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    address?: string;
    password: string;

}

const Profile = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const storedUser = localStorage.getItem('currentUser');
                const userId = storedUser ? JSON.parse(storedUser).id : null;

                if (!userId) {
                    console.error("No user ID found");
                    return;
                }

                const res = await fetch(`${API_BASE_URL}/api/account/GetUserById?id=${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Failed to fetch user");

                const data = await res.json();
                setUser(data);
                setEditedUser(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (field: keyof UserProfile, value: string) => {
        if (!editedUser) return;
        setEditedUser({ ...editedUser, [field]: value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!editedUser) return;

            const res = await fetch(`${API_BASE_URL}/api/account/UpdateUser`, {
                method: "Put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editedUser)
            });

            if (!res.ok) throw new Error("Failed to update user");

            const updatedUser = await res.json();
            setUser(updatedUser);
            setEditedUser(updatedUser);
            setIsEditing(false);

            toast({ title: "Profile updated successfully!" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error updating profile", variant: "destructive" });
        }
    };

    const handleCancel = () => {
        setEditedUser(user); 
        setIsEditing(false);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user || !editedUser) {
        return <div className="min-h-screen flex items-center justify-center">User not found</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold gradient-heading mb-6">My Profile</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card className="tourism-card overflow-hidden">
                            <div className="bg-gradient-to-r from-tourism-ocean to-tourism-teal p-6 flex flex-col items-center">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                                    <User className="h-16 w-16 text-tourism-ocean" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">{editedUser.username}</h2>

                                <h2 className="text-xl font-semibold text-white">{editedUser.firstName} {editedUser.lastName}</h2>
                                <p className="text-white/80 flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {editedUser.address}
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="font-medium mb-2 text-tourism-ocean">Contact Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                            <span>{editedUser.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                            <span>{editedUser.cellPhoneNumber}</span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card className="tourism-card p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-tourism-ocean">Personal Information</h2>
                                {!isEditing ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1 border-tourism-teal text-tourism-teal hover:bg-tourism-light-blue/50"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button size="sm" className="bg-tourism-teal text-white hover:bg-tourism-ocean" onClick={handleSave}>
                                            <Save className="h-4 w-4 mr-1" /> Save
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-100" onClick={handleCancel}>
                                            <X className="h-4 w-4 mr-1" /> Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">User name</label>
                                    <Input
                                        value={editedUser.username}
                                        disabled={true}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">First Name</label>
                                    <Input
                                        value={editedUser.firstName}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Last Name</label>
                                    <Input
                                        value={editedUser.lastName}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Email</label>
                                    <Input
                                        value={editedUser.email}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Cell Phone Number</label>
                                    <Input
                                        value={editedUser.cellPhoneNumber}  
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("cellPhoneNumber", e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Date of Birth</label>
                                    <Input
                                        type="date"
                                        value={editedUser.dateOfBirth}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1 text-gray-700">Password</label>
                                    <Input
                                        type="Password"
                                        value={editedUser.password}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                    />
                                </div>
                                
                            </div>

                            <div className="mb-6">
                                <label className="text-sm font-medium block mb-1 text-gray-700">Address</label>
                                <Input
                                    value={editedUser.address}
                                    disabled={!isEditing}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                />
                            </div>

                            
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
