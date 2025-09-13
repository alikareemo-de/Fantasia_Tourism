import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { BookingRequest, RequestStatus, fetchUserRequests, fetchRequestsToUser, approveRequest, rejectRequest, cancelRequest } from '@/services/requestApi';
import { Calendar, Clock, Users, FileText, CheckCircle, XCircle, X } from 'lucide-react';

const Requests: React.FC = () => {
    const { user } = useUser();
    const [myRequests, setMyRequests] = useState<BookingRequest[]>([]);
    const [requestsToMe, setRequestsToMe] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRequests = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const [userRequests, hostRequests] = await Promise.all([
                    fetchUserRequests(user.id),
                    fetchRequestsToUser(user.id)
                ]);
                setMyRequests(userRequests);
                setRequestsToMe(hostRequests);
            } catch (error) {
                console.error('Error loading requests:', error);
                toast({
                    title: "Error",
                    description: "Failed to load requests. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        loadRequests();
    }, [user]);

    const handleCancelRequest = async (requestId: string) => {
        try {
            await cancelRequest(requestId);
            setMyRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: RequestStatus.Cancelled } : req
            ));
            toast({
                title: "Success",
                description: "Request cancelled successfully."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to cancel request. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleApproveRequest = async (requestId: string) => {
        try {
            await approveRequest(requestId);
            setRequestsToMe(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: RequestStatus.Approved } : req
            ));
            toast({
                title: "Success",
                description: "Request approved successfully."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve request. Please try again.",
                variant: "destructive"
            });
        }
    };


    const handleRejectRequest = async (requestId: string) => {
        try {
            await rejectRequest(requestId);
            setRequestsToMe(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: RequestStatus.Rejected } : req
            ));
            toast({
                title: "Success",
                description: "Request rejected successfully."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject request. Please try again.",
                variant: "destructive"
            });
        }
    };

    const getStatusBadge = (status: RequestStatus) => {
        const variants = {
            [RequestStatus.Pending]: "secondary",
            [RequestStatus.Approved]: "default",
            [RequestStatus.Rejected]: "destructive",
            [RequestStatus.Cancelled]: "outline"
        } as const;

        const statusNames = {
            [RequestStatus.Pending]: "Pending",
            [RequestStatus.Approved]: "Approved",
            [RequestStatus.Rejected]: "Rejected",
            [RequestStatus.Cancelled]: "Cancelled"
        };

        return (
            <Badge variant={variants[status] || "secondary"}>
                {statusNames[status] || "Unknown"}
            </Badge>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading requests...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow bg-background py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Booking Requests</h1>
                        <p className="text-muted-foreground">Manage your booking requests and applications</p>
                    </div>

                    <Tabs defaultValue="my-requests" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                            <TabsTrigger value="requests-to-me">Requests to Me</TabsTrigger>
                        </TabsList>

                        <TabsContent value="my-requests" className="space-y-4">
                            <div className="grid gap-4">
                                {myRequests.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-8 text-center">
                                            <p className="text-muted-foreground">You haven't made any booking requests yet.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    myRequests.map((request) => (
                                        <Card key={request.id}>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-lg">{request.propertyName}</CardTitle>
                                                {getStatusBadge(request.status)}
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Check-in</p>
                                                            <p className="text-sm text-muted-foreground">{formatDate(request.checkInDate)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Check-out</p>
                                                            <p className="text-sm text-muted-foreground">{formatDate(request.checkOutDate)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Guests</p>
                                                            <p className="text-sm text-muted-foreground">{request.numberOfGuests}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Arrival</p>
                                                            <p className="text-sm text-muted-foreground">{request.expectedArrivalTime || 'Not specified'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {request.additionalNotes && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            <p className="text-sm font-medium">Additional Notes</p>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                                            {request.additionalNotes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-muted-foreground">
                                                        Requested on {new Date(request.createdDate).toLocaleDateString()}
                                                    </p>
                                                    {request.status === RequestStatus.Pending && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCancelRequest(request.id)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            Cancel Request
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="requests-to-me" className="space-y-4">
                            <div className="grid gap-4">
                                {requestsToMe.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-8 text-center">
                                            <p className="text-muted-foreground">You have no booking requests for your properties.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    requestsToMe.map((request) => (
                                        <Card key={request.id}>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-lg">{request.propertyName}</CardTitle>
                                                {getStatusBadge(request.status)}
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Check-in</p>
                                                            <p className="text-sm text-muted-foreground">{formatDate(request.checkInDate)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Check-out</p>
                                                            <p className="text-sm text-muted-foreground">{formatDate(request.checkOutDate)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Guests</p>
                                                            <p className="text-sm text-muted-foreground">{request.numberOfGuests}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">Arrival</p>
                                                            <p className="text-sm text-muted-foreground">{request.expectedArrivalTime || 'Not specified'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {request.additionalNotes && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            <p className="text-sm font-medium">Additional Notes/Requirements</p>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                                            {request.additionalNotes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-muted-foreground">
                                                        Requested on {new Date(request.createdDate).toLocaleDateString()}
                                                    </p>
                                                    {request.status === RequestStatus.Pending && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRejectRequest(request.id)}
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Reject Request
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApproveRequest(request.id)}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Approve Request
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Requests;