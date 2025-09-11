import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface OTPModal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const OTPModal: React.FC<OTPModal> = ({ isOpen, onClose, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const { toast } = useToast();

    const handleVerify = async () => {
        setIsVerifying(true);

        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (otp === '123456') {
            toast({
                title: "Success",
                description: "OTP verified successfully. Payment fields are now enabled.",
            });
            onSuccess();
            onClose();
            setOtp('');
        } else {
            toast({
                title: "Error",
                description: "Invalid OTP",
                variant: "destructive",
            });
        }

        setIsVerifying(false);
    };

    const handleClose = () => {
        setOtp('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verify Your Identity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Please enter the OTP to enable payment method setup.
                    </p>
                    <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={isVerifying || otp.length !== 6}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OTPModal;