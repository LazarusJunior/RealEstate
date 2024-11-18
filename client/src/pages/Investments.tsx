import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchUserInvestments } from '../redux/investmentSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Building, DollarSign } from 'lucide-react';

const Investments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { investments, loading, error } = useSelector((state: RootState) => state.investments);

  useEffect(() => {
    dispatch(fetchUserInvestments());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Investments</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {investments.map((investment) => (
          <Card key={investment.id}>
            <CardHeader>
              <CardTitle>{investment.property.name}</CardTitle>
              <CardDescription>Invested on {new Date(investment.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span className="text-2xl font-bold">${Number(investment.amount).toFixed(2)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {investment.ownershipPercentage}% ownership
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Investment Progress</span>
                  <span>{(Number(investment.amount) / Number(investment.property.targetInvestment) * 100).toFixed(2)}%</span>
                </div>
                <Progress value={Number(investment.amount) / Number(investment.property.targetInvestment) * 100} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Investments;