import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { createInvestment } from '../redux/investmentSlice';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { DollarSign, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface Property {
  id: number;
  name: string;
  description: string;
  location: string;
  targetInvestment: number;
  totalInvestments: number;
}

interface InvestmentModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ property, isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleInvest = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid investment amount');
      return;
    }

    try {
      await dispatch(createInvestment({ propertyId: property.id, amount: Number(amount) })).unwrap();
      toast.success('Investment successful!');
      onClose();
    } catch (error) {
      toast.error('Failed to process investment. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invest in {property.name}</DialogTitle>
          <DialogDescription>Enter the amount you'd like to invest in this property.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="propertyName" className="text-right">
              Property
            </Label>
            <Input id="propertyName" value={property.name} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input id="location" value={property.location} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetInvestment" className="text-right">
              Target
            </Label>
            <Input id="targetInvestment" value={`$${property.targetInvestment.toLocaleString()}`} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="Enter investment amount"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleInvest}>
            Invest Now
          </Button>
        </DialogFooter>
        <div className="mt-4 p-4 bg-muted rounded-md flex items-start">
          <Info className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Your investment will be processed securely. Please ensure you have sufficient funds in your account before proceeding.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;