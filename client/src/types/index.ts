export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Property {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  targetInvestment: number;
  currentInvestment: number;
  expectedReturn: number;
}

export interface Investment {
  id: number;
  userId: number;
  propertyId: number;
  amount: number;
  createdAt: string;
  property: Property;
}