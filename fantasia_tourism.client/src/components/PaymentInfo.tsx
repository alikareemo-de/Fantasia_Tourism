import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, MoreHorizontal } from 'lucide-react';

const PaymentInfo = () => {
    const paymentMethods = [
        {
            id: 1,
            type: 'Visa',
            last4: '4242',
            expiryMonth: '12',
            expiryYear: '2027',
            isDefault: true,
        },
        {
            id: 2,
            type: 'Mastercard',
            last4: '8888',
            expiryMonth: '06',
            expiryYear: '2026',
            isDefault: false,
        },
    ];

    return (
        <Card className="hover-lift">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-photo-secondary" />
                    <span>Payment Methods</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-photo-secondary/10 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-photo-secondary" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {method.type} •••• {method.last4}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Expires {method.expiryMonth}/{method.expiryYear}
                                    {method.isDefault && ' • Default'}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                </Button>
            </CardContent>
        </Card>
    );
};

export default PaymentInfo;