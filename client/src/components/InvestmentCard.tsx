// src/components/InvestmentCard.tsx
import React from 'react';
import { Investment, Property } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface InvestmentCardProps {
  investment: Investment;
  property: Property;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment, property }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
        <p className="text-gray-600 mb-4">{property.description}</p>
        <div className="flex items-center mb-2">
          <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">Invested Amount: {formatCurrency(investment.amount)}</span>
        </div>
        <div className="flex items-center mb-2">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">Invested on: {new Date(investment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;