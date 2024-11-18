import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchUserInvestments } from '../redux/investmentSlice';
import { fetchProperties } from '../redux/propertySlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Building, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { investments } = useSelector((state: RootState) => state.investments);
  const { properties } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
    dispatch(fetchUserInvestments());
    dispatch(fetchProperties());
  }, [dispatch]);

  const totalInvestment = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalProperties = properties.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvestment.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Invested</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              +3 new properties this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <Progress value={12.5} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
          <CardDescription>Your latest property investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.slice(0, 5).map((investment) => (
              <div key={investment.id} className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{investment.property.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(investment.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-sm font-medium">${Number(investment.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;