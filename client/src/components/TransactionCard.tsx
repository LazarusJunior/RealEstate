// src/components/TransactionCard.tsx
import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { CurrencyDollarIcon, CalendarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'Deposit':
        return <ArrowDownIcon className="h-5 w-5 text-green-500" />;
      case 'Withdrawal':
        return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
      case 'Investment':
        return <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {getTransactionIcon()}
            <span className="ml-2 font-semibold">{transaction.type}</span>
          </div>
          <span className={`font-semibold ${transaction.type === 'Withdrawal' ? 'text-red-500' : 'text-green-500'}`}>
            {transaction.type === 'Withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>{transaction.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;