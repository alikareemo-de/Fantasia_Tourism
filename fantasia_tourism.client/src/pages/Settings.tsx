
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Globe, 
  Lock, 
  CreditCard, 
  Settings as SettingsIcon, 
  User,
  Check
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold gradient-heading flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-tourism-ocean" />
            Settings
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="tourism-card p-0 overflow-hidden sticky top-24">
              <div className="bg-tourism-ocean text-white p-4">
                <h2 className="font-medium">Settings Menu</h2>
              </div>
              
              <div className="p-0">
                <button className="flex items-center w-full p-3 bg-tourism-light-blue hover:bg-tourism-light-blue/70 text-left border-l-4 border-tourism-teal">
                  <User className="mr-2 h-5 w-5 text-tourism-ocean" />
                  <span className="font-medium text-tourism-ocean">Account</span>
                </button>
                
                <button className="flex items-center w-full p-3 hover:bg-tourism-light-blue/30 text-left border-l-4 border-transparent">
                  <Bell className="mr-2 h-5 w-5 text-gray-600" />
                  <span>Notifications</span>
                </button>
                
                <button className="flex items-center w-full p-3 hover:bg-tourism-light-blue/30 text-left border-l-4 border-transparent">
                  <Lock className="mr-2 h-5 w-5 text-gray-600" />
                  <span>Privacy & Security</span>
                </button>
                
                <button className="flex items-center w-full p-3 hover:bg-tourism-light-blue/30 text-left border-l-4 border-transparent">
                  <CreditCard className="mr-2 h-5 w-5 text-gray-600" />
                  <span>Payment Methods</span>
                </button>
                
                <button className="flex items-center w-full p-3 hover:bg-tourism-light-blue/30 text-left border-l-4 border-transparent">
                  <Globe className="mr-2 h-5 w-5 text-gray-600" />
                  <span>Language & Region</span>
                </button>
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="tourism-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-tourism-ocean">Account Settings</h2>
                <Button className="tourism-btn">Save Changes</Button>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-4">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm mb-1.5 block">Email Address</Label>
                      <Input id="email" placeholder="john@example.com" defaultValue="john.smith@example.com" className="border-tourism-light-blue focus-visible:ring-tourism-teal" />
                    </div>
                    
                    <div>
                      <Label htmlFor="username" className="text-sm mb-1.5 block">Username</Label>
                      <Input id="username" defaultValue="john_smith" className="border-tourism-light-blue focus-visible:ring-tourism-teal" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Change Password</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-password" className="text-sm mb-1.5 block">Current Password</Label>
                      <Input id="current-password" type="password" className="border-tourism-light-blue focus-visible:ring-tourism-teal" />
                    </div>
                    
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-password" className="text-sm mb-1.5 block">New Password</Label>
                        <Input id="new-password" type="password" className="border-tourism-light-blue focus-visible:ring-tourism-teal" />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-password" className="text-sm mb-1.5 block">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" className="border-tourism-light-blue focus-visible:ring-tourism-teal" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive emails about your account activity and bookings</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-gray-500">Receive promotional emails, newsletters, and special offers</p>
                      </div>
                      <Switch id="marketing-emails" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive text messages for booking confirmations and updates</p>
                      </div>
                      <Switch id="sms-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="tourism-card p-6 mt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-tourism-ocean mb-1">Account Verification</h3>
                  <p className="text-gray-600 text-sm">Your account is verified and in good standing</p>
                </div>
                <div className="bg-tourism-green/20 p-1.5 rounded-full">
                  <Check className="h-5 w-5 text-tourism-green" />
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-tourism-light-blue/20 rounded-lg">
                <p className="text-sm text-gray-700">
                  Your account is verified and has full access to all Fantasia Tourism features. If you need to change your verification details, please contact customer support.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
