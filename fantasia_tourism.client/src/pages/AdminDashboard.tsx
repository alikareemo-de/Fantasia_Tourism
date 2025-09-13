import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Building } from "lucide-react";
import Navigation from "@/components/Navigation";

const AdminDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage users, properties, and requests</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Users Management Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-primary" />
                                Users Management
                            </CardTitle>
                            <CardDescription>
                                Manage user accounts, block/unblock users, and user permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/admin/users">
                                <Button className="w-full">
                                    Manage Users
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Requests Management Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-6 w-6 text-primary" />
                                Requests Management
                            </CardTitle>
                            <CardDescription>
                                View and manage all booking requests from users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/admin/requests">
                                <Button className="w-full">
                                    Manage Requests
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Properties Management Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-6 w-6 text-primary" />
                                Properties Management
                            </CardTitle>
                            <CardDescription>
                                Manage property listings, approve or reject submissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/admin/properties">
                                <Button className="w-full">
                                    Manage Properties
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;