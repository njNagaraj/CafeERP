
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`text-3xl md:text-4xl ${color}`}>
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
  );
};

export default Card;