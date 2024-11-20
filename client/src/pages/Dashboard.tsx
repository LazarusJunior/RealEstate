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
    <div className="space-y-6 p-6 bg-white">
      <h1 className="text-3xl font-bold text-blue-950">Welcome, {user?.name}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-950">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-950">${totalInvestment.toFixed(2)}</div>
            <p className="text-xs text-blue-600">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-950">Properties Invested</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-950">{totalProperties}</div>
            <p className="text-xs text-blue-600">
              +3 new properties this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-950">Portfolio Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-950">+12.5%</div>
            <Progress 
              value={12.5} 
              className="mt-2 bg-blue-100"
              // indicatorClassName="bg-blue-600"
            />
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white border-blue-100 shadow-sm">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-blue-950">Recent Investments</CardTitle>
          <CardDescription className="text-blue-800">Your latest property investments</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {investments.slice(0, 5).map((investment) => (
              <div key={investment.id} className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                <Building className="mr-2 h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-950">{investment.property.name}</p>
                  <p className="text-xs text-blue-600">{new Date(investment.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-sm font-medium text-blue-950">${Number(investment.amount).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;