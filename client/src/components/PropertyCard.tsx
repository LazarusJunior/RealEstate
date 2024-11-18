// src/components/PropertyCard.tsx
import React from 'react';
import { Property } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface PropertyCardProps {
  property: Property;
  onInvest: (propertyId: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onInvest }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={`https://source.unsplash.com/800x600/?property,real,estate&sig=${property.id}`}
        alt={property.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
        <p className="text-gray-600 mb-4">{property.description}</p>
        <div className="flex items-center mb-2">
          <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{property.location}</span>
        </div>
        <div className="flex items-center mb-4">
          <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">Target Investment: {formatCurrency(property.targetInvestment)}</span>
        </div>
        <button
          onClick={() => onInvest(property.id)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Invest Now
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;