import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchUserAccount, updateBalance } from '../redux/userAccountSlice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserAccount: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { balance, transactions, loading, error } = useSelector((state: RootState) => state.userAccount);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    dispatch(fetchUserAccount());
  }, [dispatch]);

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await dispatch(updateBalance({ amount: Number(amount), type })).unwrap();
      toast.success(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful`);
      setAmount('');
      dispatch(fetchUserAccount());
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to ${type}: ${error.message}`);
      } else {
        toast.error(`Failed to ${type}`);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current account balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold flex items-center">
              <DollarSign className="mr-2" />
              {balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deposit / Withdraw</CardTitle>
            <CardDescription>Manage your account balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => handleTransaction('deposit')} className="w-[45%]">
              <ArrowUpCircle className="mr-2" /> Deposit
            </Button>
            <Button onClick={() => handleTransaction('withdraw')} className="w-[45%]" variant="outline">
              <ArrowDownCircle className="mr-2" /> Withdraw
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your last 5 transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccount;

