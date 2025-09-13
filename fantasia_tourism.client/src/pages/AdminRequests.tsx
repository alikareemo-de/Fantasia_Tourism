import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Trash2, FileText } from "lucide-react";
import { Link } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import { fetchAllRequests, deleteRequest } from "@/services/adminApi";
import { approveRequest, rejectRequest, RequestStatus, BookingRequest } from "@/services/requestApi";

const AdminRequests: React.FC = () => {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const requestsData = await fetchAllRequests();
            setRequests(requestsData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load requests",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRequest = async (requestId: string) => {
        try {
            await approveRequest(requestId);
            await loadRequests();
            toast({
                title: "Success",
                description: "Request has been approved",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve request",
                variant: "destructive",
            });
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await rejectRequest(requestId);
            await loadRequests();
            toast({
                title: "Success",
                description: "Request has been rejected",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject request",
                variant: "destructive",
            });
        }
    };

    const handleDeleteRequest = async (requestId: string) => {
        try {
            await deleteRequest(requestId);
            await loadRequests();
            toast({
                title: "Success",
                description: "Request has been deleted permanently",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete request",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.Pending:
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case RequestStatus.Approved:
                return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
            case RequestStatus.Rejected:
                return <Badge variant="destructive">Rejected</Badge>;
            case RequestStatus.Cancelled:
                return <Badge variant="secondary">Cancelled</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Loading requests...</div>
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
                        <FileText className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Requests Management</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Booking Requests ({requests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Check-in</TableHead>
                                    <TableHead>Check-out</TableHead>
                                    <TableHead>Guests</TableHead>
                                    <TableHead>Arrival Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.propertyName}</TableCell>
                                        <TableCell>{request.checkInDate || 'TBD'}</TableCell>
                                        <TableCell>{request.checkOutDate || 'TBD'}</TableCell>
                                        <TableCell>{request.numberOfGuests}</TableCell>
                                        <TableCell>{request.expectedArrivalTime || 'TBD'}</TableCell>
                                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                                        <TableCell>{new Date(request.createdDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {request.additionalNotes || 'None'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {request.status === RequestStatus.Pending && (
                                                    <>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                                                                    <Check className="h-4 w-4" />
                                                                    Approve
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Approve Request</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to approve this booking request for {request.propertyName}?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleApproveRequest(request.id)}>
                                                                        Approve Request
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                                                                    <X className="h-4 w-4" />
                                                                    Reject
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Reject Request</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to reject this booking request for {request.propertyName}?
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleRejectRequest(request.id)}>
                                                                        Reject Request
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </>
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
                                                            <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to permanently delete this request?
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteRequest(request.id)}
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

export default AdminRequests;