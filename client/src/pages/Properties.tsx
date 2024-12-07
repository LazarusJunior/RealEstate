import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchProperties } from '../redux/propertySlice';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Building, MapPin, DollarSign } from 'lucide-react';
import InvestmentModal from '../components/InvestmentModal';

const Properties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector((state: RootState) => state.properties.properties);
  const loading = useSelector((state: RootState) => state.properties.loading);
  const error = useSelector((state: RootState) => state.properties.error);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleInvestClick = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-blue-600">Loading properties...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-950">Available Properties</h1>
      {properties.length === 0 ? (
        <p className="text-blue-900">No properties available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card 
              key={property.id} 
              className="flex flex-col border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
            >
              <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-xl">
                <CardTitle className="flex items-center text-blue-950">
                  <Building className="mr-2 text-blue-600" />
                  {property.name}
                </CardTitle>
                <CardDescription className="flex items-center text-blue-800">
                  <MapPin className="mr-2 text-blue-500" size={16} />
                  {property.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-4 text-blue-900">{property.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-800">Investment Progress</span>
                  <span className="text-sm font-medium text-blue-950">
                    ${property.totalInvestments?.toLocaleString() ?? 0} / ${property.targetInvestment?.toLocaleString() ?? 0}
                  </span>
                </div>
                <Progress 
                  value={((property.totalInvestments ?? 0) / (property.targetInvestment ?? 1)) * 100} 
                  className="mb-4 bg-blue-100"
                  // indicatorClassName="bg-blue-600"
                />
              </CardContent>
              <CardFooter className="mt-auto">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={() => handleInvestClick(property)}
                >
                  <DollarSign className="mr-2" />
                  Invest Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {selectedProperty && (
        <InvestmentModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Properties;