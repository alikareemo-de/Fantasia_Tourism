
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyDetails from "./pages/PropertyDetails";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import AddBook from "./pages/AddBook";
import Properties from "./pages/Properties";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";
import AdminProperties from "./pages/AdminProperties";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <UserProvider>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/property/:id" element={<PropertyDetails />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/requests" element={<Requests />} />
                        <Route path="/add-book/:id" element={<AddBook />} />
                        <Route path="/properties" element={<Properties />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/admin" element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/users" element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminUsers />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/requests" element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminRequests />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/properties" element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminProperties />
                            </ProtectedRoute>
                        } />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </UserProvider>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
