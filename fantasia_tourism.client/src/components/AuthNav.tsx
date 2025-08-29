
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import { User, LogIn, LogOut, UserCircle, Settings, Home, Building, LayoutDashboard } from "lucide-react";
import SignInModal from '@/components/SignInModal';
import RegisterModal from '@/components/RegisterModal';
import { toast } from 'sonner';

const AuthNav: React.FC = () => {
  const { user, signOut, isLoading } = useUser();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    toast.success("You've been signed out successfully");
  };

  if (isLoading) {
    return <div className="flex gap-2">
      <Button disabled variant="outline" size="sm" className="h-9 px-3">Sign In</Button>
      <Button disabled variant="default" size="sm" className="h-9 px-3">Register</Button>
    </div>;
  }

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline-block">
            Hello, {user.firstName}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-9 w-9 bg-tourism-light-blue hover:bg-tourism-teal/20"
              >
                <UserCircle className="h-5 w-5 text-tourism-ocean" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/properties" className="cursor-pointer">
                    <Building className="mr-2 h-4 w-4" />
                    <span>Properties</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSignInModalOpen(true)} 
            className="h-9 px-3 border-tourism-teal text-tourism-ocean hover:bg-tourism-light-blue"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsRegisterModalOpen(true)} 
            className="h-9 px-3 bg-tourism-ocean hover:bg-tourism-teal text-white"
          >
            <User className="mr-2 h-4 w-4" />
            Register
          </Button>
        </div>
      )}

      {/* Modals */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </>
  );
};

export default AuthNav;
