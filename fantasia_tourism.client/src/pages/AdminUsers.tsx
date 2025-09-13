import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, ShieldOff, Trash2, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import { AdminUser, fetchAllUsers, blockUser, unblockUser, deleteUser } from "@/services/adminApi";

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await fetchAllUsers();
            setUsers(usersData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load users",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId: string) => {
        try {
            await blockUser(userId);
            await loadUsers();
            toast({
                title: "Success",
                description: "User has been blocked",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to block user",
                variant: "destructive",
            });
        }
    };

    const handleUnblockUser = async (userId: string) => {
        try {
            await unblockUser(userId);
            await loadUsers();
            toast({
                title: "Success",
                description: "User has been unblocked",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to unblock user",
                variant: "destructive",
            });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
            await loadUsers();
            toast({
                title: "Success",
                description: "User has been deleted permanently",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Loading users...</div>
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
                        <Users className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Users ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.cellPhoneNumber || 'N/A'}</TableCell>
                                        <TableCell>
                                            {user.city && user.country ? `${user.city}, ${user.country}` : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isBlocked ? "destructive" : "default"}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(user.createdDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {user.isBlocked ? (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Shield className="h-4 w-4" />
                                                                Unblock
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Unblock User</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to unblock {user.firstName} {user.lastName}?
                                                                    They will regain access to their account.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleUnblockUser(user.id)}>
                                                                    Unblock User
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                ) : (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <ShieldOff className="h-4 w-4" />
                                                                Block
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Block User</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to block {user.firstName} {user.lastName}?
                                                                    They will lose access to their account.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleBlockUser(user.id)}>
                                                                    Block User
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
                                                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to permanently delete {user.firstName} {user.lastName}?
                                                                This action cannot be undone and will remove all their data.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteUser(user.id)}
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

export default AdminUsers;