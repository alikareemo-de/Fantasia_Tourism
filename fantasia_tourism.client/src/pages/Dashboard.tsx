
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Compass, Home, User, Settings, Map } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold gradient-heading flex items-center gap-2">
            <Compass className="h-8 w-8 text-tourism-ocean" />
            Dashboard
          </h1>
          <div className="text-sm text-gray-500 mt-2 md:mt-0">
            Last updated: May 17, 2025
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="tourism-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-tourism-ocean">Trip Overview</h2>
              <Map className="h-5 w-5 text-tourism-teal" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Upcoming Trips</span>
                  <span className="font-medium text-tourism-ocean">2</span>
                </div>
                <Progress value={40} className="h-2 bg-tourism-light-blue">
                  <div className="bg-tourism-teal h-full" />
                </Progress>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completed Trips</span>
                  <span className="font-medium text-tourism-ocean">8</span>
                </div>
                <Progress value={80} className="h-2 bg-tourism-light-blue">
                  <div className="bg-tourism-ocean h-full" />
                </Progress>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Saved Destinations</span>
                  <span className="font-medium text-tourism-ocean">15</span>
                </div>
                <Progress value={60} className="h-2 bg-tourism-light-blue">
                  <div className="bg-tourism-sky h-full" />
                </Progress>
              </div>
            </div>
          </Card>
          
          <Card className="tourism-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-tourism-ocean">Account Status</h2>
              <User className="h-5 w-5 text-tourism-teal" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span className="font-medium text-tourism-ocean">85%</span>
                </div>
                <Progress value={85} className="h-2 bg-tourism-light-blue">
                  <div className="bg-tourism-teal h-full" />
                </Progress>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Verification Status</span>
                  <span className="font-medium text-tourism-ocean">Complete</span>
                </div>
                <Progress value={100} className="h-2 bg-tourism-light-blue">
                  <div className="bg-tourism-green h-full" />
                </Progress>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Loyalty Points</span>
                  <span className="font-medium text-tourism-ocean">450 pts</span>
                </div>
                <Progress value={45} className="h-2 bg-tourism-light-blue">
                  <div className="bg-tourism-sunset h-full" />
                </Progress>
              </div>
            </div>
          </Card>
          
          <Card className="tourism-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-tourism-ocean">Recent Activity</h2>
              <Home className="h-5 w-5 text-tourism-teal" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-tourism-light-blue p-1 rounded mr-3">
                  <Home className="h-4 w-4 text-tourism-ocean" />
                </div>
                <div>
                  <p className="text-sm font-medium">Booked Beach House</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-tourism-light-blue p-1 rounded mr-3">
                  <Map className="h-4 w-4 text-tourism-ocean" />
                </div>
                <div>
                  <p className="text-sm font-medium">Added to Wishlist</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-tourism-light-blue p-1 rounded mr-3">
                  <Settings className="h-4 w-4 text-tourism-ocean" />
                </div>
                <div>
                  <p className="text-sm font-medium">Updated Profile</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 tourism-card">
          <h2 className="text-xl font-semibold mb-4 text-tourism-ocean">Your Travel Statistics</h2>
          <Separator className="my-4" />
          <p className="text-gray-600">
            Your personalized travel statistics and analytics will be displayed here once you have completed more trips with Fantasia Tourism.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
