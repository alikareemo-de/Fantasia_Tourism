import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, EyeOff, X, Trash2, Building } from "lucide-react";
import { Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import { AdminProperty, fetchAllProperties, deleteProperty, deactivateProperty, rejectProperty } from "@/services/adminApi";

const AdminProperties: React.FC = () => {
    const [properties, setProperties] = useState<AdminProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const propertiesData = await fetchAllProperties();
            setProperties(propertiesData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load properties",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProperty = async (propertyId: string) => {
        try {
            await deleteProperty(propertyId);
            await loadProperties();
            toast({
                title: "Success",
                description: "Property has been deleted permanently",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete property",
                variant: "destructive",
            });
        }
    };

    const handleDeactivateProperty = async (propertyId: string) => {
        try {
            await deactivateProperty(propertyId);
            await loadProperties();
            toast({
                title: "Success",
                description: "Property has been deactivated",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to deactivate property",
                variant: "destructive",
            });
        }
    };

    const handleRejectProperty = async (propertyId: string) => {
        try {
            await rejectProperty(propertyId);
            await loadProperties();
            toast({
                title: "Success",
                description: "Property has been rejected",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject property",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Available</Badge>;
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status || 'Unknown'}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Loading properties...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/admin">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Building className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Properties Management</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Properties ({properties.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Rooms</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.map((property) => (
                                    <TableRow key={property.id}>
                                        <TableCell className="font-medium">{property.title}</TableCell>
                                        <TableCell>
                                            {property.city && property.country
                                                ? `${property.city}, ${property.country}`
                                                : property.location}
                                        </TableCell>
                                        <TableCell>${property.price}</TableCell>
                                        <TableCell>{property.capacity || 'N/A'}</TableCell>
                                        <TableCell>{property.rooms || 'N/A'}</TableCell>
                                        <TableCell>{getStatusBadge(property.status)}</TableCell>
                                        <TableCell>
                                            {property.createdDate
                                                ? new Date(property.createdDate).toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {property.expireDate
                                                ? new Date(property.expireDate).toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {property.status?.toLowerCase() === 'available' && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <EyeOff className="h-4 w-4" />
                                                                Deactivate
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Deactivate Property</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to deactivate "{property.title}"?
                                                                    It will no longer be visible to users.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeactivateProperty(property.id)}>
                                                                    Deactivate Property
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}

                                                {property.status?.toLowerCase() === 'pending' && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                                                                <X className="h-4 w-4" />
                                                                Reject
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Reject Property</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to reject "{property.title}"?
                                                                    The owner will be notified of the rejection.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleRejectProperty(property.id)}>
                                                                    Reject Property
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to permanently delete "{property.title}"?
                                                                This action cannot be undone and will remove all related data.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteProperty(property.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete Permanently
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminProperties;