/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useUser } from '@/contexts/UserContext';
import OTPModal from '@/components/OTPModal';
import {
    changePassword,
    getPaymentInfoByUserId,
    updatePayment,
    getSettings,
    updateSettings
} from '@/services/settingsApi';
import {
    Bell,
    Globe,
    Lock,
    CreditCard,
    Settings as SettingsIcon,
    User,
    Check,
    Palette,
    Save
} from 'lucide-react';

const Settings = () => {
    const { toast } = useToast();
    const { theme, setTheme, availableThemes } = useTheme();
    const { user } = useUser();
    const [activeSection, setActiveSection] = useState('account');
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [paymentFieldsEnabled, setPaymentFieldsEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Application settings state
    const [appSettings, setAppSettings] = useState({
        theme: 1,
        emailNotifications: false,
        smsNotifications: false,
    });

    // Payment form data
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        billingAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    // Load settings on component mount
    useEffect(() => {
        if (user?.id) {
            loadUserSettings();
            loadPaymentInfo();
        }
    }, [user]);

    const loadUserSettings = async () => {
        try {
            const settings = await getSettings();
            setAppSettings(prev => ({
                ...prev,
                ...settings,
                theme: settings.theme || getThemeEnumValue(theme)
            }));
            if (settings.theme) {
                // Convert enum value to theme name
                let themeName: 'light' | 'dark' | 'blue';
                switch (settings.theme) {
                    case 1: themeName = 'light'; break;
                    case 2: themeName = 'dark'; break;
                    case 3: themeName = 'blue'; break;
                    default: themeName = 'light';
                }
                if (themeName !== theme) {
                    setTheme(themeName);
                }
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const loadPaymentInfo = async () => {
        if (!user?.id) return;

        try {
            const paymentInfo = await getPaymentInfoByUserId(user.id);
            if (paymentInfo) {
                setPaymentData(paymentInfo);
                setPaymentFieldsEnabled(true);
            }
        } catch (error) {
            console.error('Failed to load payment info:', error);
        }
    };

    const handleOTPSuccess = () => {
        setPaymentFieldsEnabled(true);
    };

    const handlePaymentInputChange = (field: string, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast({
                title: "Error",
                description: "Please fill in all password fields.",
                variant: "destructive",
            });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast({
                title: "Password changed successfully",
                description: "Your password has been updated.",
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to change password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSavePaymentInfo = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            await updatePayment(user.id, paymentData);
            toast({
                title: "Payment method saved successfully",
                description: "Your payment information has been securely stored.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save payment method. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = (value: string) => {
        let themeName: 'light' | 'dark' | 'blue';
        switch (value) {
            case '1': themeName = 'light'; break;
            case '2': themeName = 'dark'; break;
            case '3': themeName = 'blue'; break;
            default: themeName = 'light';
        }
        setTheme(themeName);
        setAppSettings(prev => ({ ...prev, theme: parseInt(value) }));
    };

    const getThemeEnumValue = (themeName: string): number => {
        switch (themeName) {
            case 'light': return 1;
            case 'dark': return 2;
            case 'blue': return 3;
            default: return 1;
        }
    };
    const handleSaveAppSettings = async () => {
        setLoading(true);
        try {
            await updateSettings(appSettings);
            toast({
                title: "Settings saved successfully",
                description: "Your application settings have been updated.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getThemeDisplayName = (theme: string) => {
        switch (theme) {
            case 'light': return 'Light';
            case 'dark': return 'Dark';
            case 'blue': return 'Blue';
            default: return theme;
        }
    };

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
                                <button
                                    className={`flex items-center w-full p-3 text-left border-l-4 ${activeSection === 'account'
                                            ? 'bg-tourism-light-blue hover:bg-tourism-light-blue/70 border-tourism-teal'
                                            : 'hover:bg-tourism-light-blue/30 border-transparent'
                                        }`}
                                    onClick={() => setActiveSection('account')}
                                >
                                    <User className={`mr-2 h-5 w-5 ${activeSection === 'account' ? 'text-tourism-ocean' : 'text-gray-600'}`} />
                                    <span className={activeSection === 'account' ? 'font-medium text-tourism-ocean' : ''}>Account</span>
                                </button>

                                <button
                                    className={`flex items-center w-full p-3 text-left border-l-4 ${activeSection === 'payment'
                                            ? 'bg-tourism-light-blue hover:bg-tourism-light-blue/70 border-tourism-teal'
                                            : 'hover:bg-tourism-light-blue/30 border-transparent'
                                        }`}
                                    onClick={() => setActiveSection('payment')}
                                >
                                    <CreditCard className={`mr-2 h-5 w-5 ${activeSection === 'payment' ? 'text-tourism-ocean' : 'text-gray-600'}`} />
                                    <span className={activeSection === 'payment' ? 'font-medium text-tourism-ocean' : ''}>Payment Method</span>
                                </button>

                                <button
                                    className={`flex items-center w-full p-3 text-left border-l-4 ${activeSection === 'application'
                                            ? 'bg-tourism-light-blue hover:bg-tourism-light-blue/70 border-tourism-teal'
                                            : 'hover:bg-tourism-light-blue/30 border-transparent'
                                        }`}
                                    onClick={() => setActiveSection('application')}
                                >
                                    <Palette className={`mr-2 h-5 w-5 ${activeSection === 'application' ? 'text-tourism-ocean' : 'text-gray-600'}`} />
                                    <span className={activeSection === 'application' ? 'font-medium text-tourism-ocean' : ''}>Application Settings</span>
                                </button>

                                <button
                                    className={`flex items-center w-full p-3 text-left border-l-4 ${activeSection === 'notifications'
                                            ? 'bg-tourism-light-blue hover:bg-tourism-light-blue/70 border-tourism-teal'
                                            : 'hover:bg-tourism-light-blue/30 border-transparent'
                                        }`}
                                    onClick={() => setActiveSection('notifications')}
                                >
                                    <Bell className={`mr-2 h-5 w-5 ${activeSection === 'notifications' ? 'text-tourism-ocean' : 'text-gray-600'}`} />
                                    <span className={activeSection === 'notifications' ? 'font-medium text-tourism-ocean' : ''}>Notifications</span>
                                </button>

                                <button
                                    className={`flex items-center w-full p-3 text-left border-l-4 ${activeSection === 'privacy'
                                            ? 'bg-tourism-light-blue hover:bg-tourism-light-blue/70 border-tourism-teal'
                                            : 'hover:bg-tourism-light-blue/30 border-transparent'
                                        }`}
                                    onClick={() => setActiveSection('privacy')}
                                >
                                    <Lock className={`mr-2 h-5 w-5 ${activeSection === 'privacy' ? 'text-tourism-ocean' : 'text-gray-600'}`} />
                                    <span className={activeSection === 'privacy' ? 'font-medium text-tourism-ocean' : ''}>Privacy & Security</span>
                                </button>

                                <button
                                    className={`flex items-center w-full p-3 text-left border-l-4 ${activeSection === 'language'
                                            ? 'bg-tourism-light-blue hover:bg-tourism-light-blue/70 border-tourism-teal'
                                            : 'hover:bg-tourism-light-blue/30 border-transparent'
                                        }`}
                                    onClick={() => setActiveSection('language')}
                                >
                                    <Globe className={`mr-2 h-5 w-5 ${activeSection === 'language' ? 'text-tourism-ocean' : 'text-gray-600'}`} />
                                    <span className={activeSection === 'language' ? 'font-medium text-tourism-ocean' : ''}>Language & Region</span>
                                </button>
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        {/* Account Settings Section */}
                        {activeSection === 'account' && (
                            <Card className="tourism-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-tourism-ocean">Account Settings</h2>
                                    <Button onClick={handleChangePassword} disabled={loading} className="tourism-btn">
                                        {loading ? 'Saving...' : 'Change Password'}
                                    </Button>
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
                                                <Input
                                                    id="current-password"
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                    className="border-tourism-light-blue focus-visible:ring-tourism-teal"
                                                />
                                            </div>

                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="new-password" className="text-sm mb-1.5 block">New Password</Label>
                                                    <Input
                                                        id="new-password"
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        className="border-tourism-light-blue focus-visible:ring-tourism-teal"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="confirm-password" className="text-sm mb-1.5 block">Confirm New Password</Label>
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        className="border-tourism-light-blue focus-visible:ring-tourism-teal"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Payment Method Section */}
                        {activeSection === 'payment' && (
                            <Card className="tourism-card p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-tourism-ocean">Payment Method</h2>
                                    {!paymentFieldsEnabled && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1 border-tourism-teal text-tourism-teal hover:bg-tourism-light-blue/50"
                                            onClick={() => setIsOTPModalOpen(true)}
                                        >
                                            <Lock className="h-4 w-4" />
                                            Add Payment Method
                                        </Button>
                                    )}
                                    {paymentFieldsEnabled && (
                                        <Button onClick={handleSavePaymentInfo} disabled={loading} className="tourism-btn">
                                            <Save className="h-4 w-4 mr-2" />
                                            {loading ? 'Saving...' : 'Save Payment Info'}
                                        </Button>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">Card Number</Label>
                                        <Input
                                            value={paymentData.cardNumber}
                                            onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="1234 5678 9012 3456"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">Cardholder Name</Label>
                                        <Input
                                            value={paymentData.cardholderName}
                                            onChange={(e) => handlePaymentInputChange('cardholderName', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="John Smith"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">Expiry Date</Label>
                                        <Input
                                            value={paymentData.expiryDate}
                                            onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="MM/YY"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">CVV</Label>
                                        <Input
                                            value={paymentData.cvv}
                                            onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="123"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">Billing Address</Label>
                                        <Input
                                            value={paymentData.billingAddress}
                                            onChange={(e) => handlePaymentInputChange('billingAddress', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="123 Main Street"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">City</Label>
                                        <Input
                                            value={paymentData.city}
                                            onChange={(e) => handlePaymentInputChange('city', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="New York"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">State/Province</Label>
                                        <Input
                                            value={paymentData.state}
                                            onChange={(e) => handlePaymentInputChange('state', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="NY"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">ZIP Code</Label>
                                        <Input
                                            value={paymentData.zipCode}
                                            onChange={(e) => handlePaymentInputChange('zipCode', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="10001"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium block mb-1 text-gray-700">Country</Label>
                                        <Input
                                            value={paymentData.country}
                                            onChange={(e) => handlePaymentInputChange('country', e.target.value)}
                                            disabled={!paymentFieldsEnabled}
                                            placeholder="United States"
                                            className={!paymentFieldsEnabled ? "bg-gray-100" : ""}
                                        />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Application Settings Section */}
                        {activeSection === 'application' && (
                            <Card className="tourism-card p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-tourism-ocean">Application Settings</h2>
                                    <Button onClick={handleSaveAppSettings} disabled={loading} className="tourism-btn">
                                        <Save className="h-4 w-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </div>

                                <Separator className="mb-6" />

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium text-lg mb-4">Theme & Appearance</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium block mb-2">Select Theme</Label>
                                                <Select value={appSettings.theme.toString()} onValueChange={handleThemeChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select theme" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Light</SelectItem>
                                                        <SelectItem value="2">Dark</SelectItem>
                                                        <SelectItem value="3">Blue</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Current theme: {appSettings.theme === 1 ? 'Light' : appSettings.theme === 2 ? 'Dark' : 'Blue'}
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Email Notifications</p>
                                                        <p className="text-sm text-gray-500">Receive emails about your account activity and bookings</p>
                                                    </div>
                                                    <Switch checked={appSettings.emailNotifications}
                                                        onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, emailNotifications: checked }))}
                                                    />
                                                </div>


                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">SMS Notifications</p>
                                                        <p className="text-sm text-gray-500">Receive text messages for booking confirmations and updates</p>
                                                    </div>
                                                    <Switch checked={appSettings.smsNotifications}
                                                        onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, smsNotifications: checked }))}
                                                    />
                                                </div>
                                              
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/*<div>*/}
                                    {/*    <h3 className="font-medium text-lg mb-4">General Preferences</h3>*/}

                                    {/*    <div className="space-y-4">*/}

                                    {/*        */}{/*<div className="flex items-center justify-between">*/}
                                    {/*        */}{/*    <div>*/}
                                    {/*        */}{/*        <p className="font-medium">Auto-save</p>*/}
                                    {/*        */}{/*        <p className="text-sm text-gray-500">Automatically save your changes</p>*/}
                                    {/*        */}{/*    </div>*/}
                                    {/*        */}{/*    <Switch*/}
                                    {/*        */}{/*        checked={appSettings.autoSave}*/}
                                    {/*        */}{/*        onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, autoSave: checked }))}*/}
                                    {/*        */}{/*    />*/}
                                    {/*        */}{/*</div>*/}

                                    {/*        */}{/*<div className="flex items-center justify-between">*/}
                                    {/*        */}{/*    <div>*/}
                                    {/*        */}{/*        <p className="font-medium">Email Updates</p>*/}
                                    {/*        */}{/*        <p className="text-sm text-gray-500">Receive updates about new features</p>*/}
                                    {/*        */}{/*    </div>*/}
                                    {/*        */}{/*    <Switch*/}
                                    {/*        */}{/*        checked={appSettings.emailUpdates}*/}
                                    {/*        */}{/*        onCheckedChange={(checked) => setAppSettings(prev => ({ ...prev, emailUpdates: checked }))}*/}
                                    {/*        */}{/*    />*/}
                                    {/*        */}{/*</div>*/}

                                    {/*        */}{/*<div>*/}
                                    {/*        */}{/*    <Label className="text-sm font-medium block mb-2">Language</Label>*/}
                                    {/*        */}{/*    <Select*/}
                                    {/*        */}{/*        value={appSettings.language}*/}
                                    {/*        */}{/*        onValueChange={(value) => setAppSettings(prev => ({ ...prev, language: value }))}*/}
                                    {/*        */}{/*    >*/}
                                    {/*        */}{/*        <SelectTrigger className="w-full">*/}
                                    {/*        */}{/*            <SelectValue />*/}
                                    {/*        */}{/*        </SelectTrigger>*/}
                                    {/*        */}{/*        <SelectContent>*/}
                                    {/*        */}{/*            <SelectItem value="en">English</SelectItem>*/}
                                    {/*        */}{/*            <SelectItem value="es">Spanish</SelectItem>*/}
                                    {/*        */}{/*            <SelectItem value="fr">French</SelectItem>*/}
                                    {/*        */}{/*            <SelectItem value="de">German</SelectItem>*/}
                                    {/*        */}{/*        </SelectContent>*/}
                                    {/*        */}{/*    </Select>*/}
                                    {/*        */}{/*</div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </Card>
                        )}

                        {/* Other sections... */}
                        {activeSection === 'notifications' && (
                            <Card className="tourism-card p-6">
                                <h2 className="text-xl font-semibold text-tourism-ocean mb-6">Notification Preferences</h2>
                                <Separator className="mb-6" />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-gray-500">Receive emails about your account activity and bookings</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Marketing Communications</p>
                                            <p className="text-sm text-gray-500">Receive promotional emails, newsletters, and special offers</p>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">SMS Notifications</p>
                                            <p className="text-sm text-gray-500">Receive text messages for booking confirmations and updates</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {(activeSection === 'privacy' || activeSection === 'language') && (
                            <Card className="tourism-card p-6">
                                <h2 className="text-xl font-semibold text-tourism-ocean mb-6">
                                    {activeSection === 'privacy' ? 'Privacy & Security' : 'Language & Region'}
                                </h2>
                                <Separator className="mb-6" />
                                <p className="text-gray-600">
                                    {activeSection === 'privacy'
                                        ? 'Privacy and security settings will be available here.'
                                        : 'Language and region settings will be available here.'
                                    }
                                </p>
                            </Card>
                        )}

                        {/* Account Verification Status */}
                        {/*<Card className="tourism-card p-6 mt-6">*/}
                        {/*    <div className="flex justify-between items-start">*/}
                        {/*        <div>*/}
                        {/*            <h3 className="text-lg font-medium text-tourism-ocean mb-1">Account Verification</h3>*/}
                        {/*            <p className="text-gray-600 text-sm">Your account is verified and in good standing</p>*/}
                        {/*        </div>*/}
                        {/*        <div className="bg-tourism-green/20 p-1.5 rounded-full">*/}
                        {/*            <Check className="h-5 w-5 text-tourism-green" />*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                        {/*    <div className="mt-4 p-3 bg-tourism-light-blue/20 rounded-lg">*/}
                        {/*        <p className="text-sm text-gray-700">*/}
                        {/*            Your account is verified and has full access to all Fantasia Tourism features. If you need to change your verification details, please contact customer support.*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*</Card>*/}
                    </div>
                </div>
            </main>

            <OTPModal
                isOpen={isOTPModalOpen}
                onClose={() => setIsOTPModalOpen(false)}
                onSuccess={handleOTPSuccess}
            />

            <Footer />
        </div>
    );
};

export default Settings;