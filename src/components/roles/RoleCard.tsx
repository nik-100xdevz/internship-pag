import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { InternshipRole } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface RoleCardProps {
  role: InternshipRole;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  const navigate = useNavigate();
  
  // Get the icon component dynamically
  const IconComponent = Icons[role.icon as keyof typeof Icons] as React.ComponentType<any>;

  const handleClick = () => {
    navigate(`/internships/${role.id}`);
  };

  return (
    <Card 
      hover 
      onClick={handleClick}
      className="cursor-pointer transform transition-all duration-300 hover:scale-105"
    >
      <CardContent className="p-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${role.color} rounded-xl mb-4 shadow-lg`}>
          {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {role.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {role.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600">
            {role.count} positions
          </span>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Icons.ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};