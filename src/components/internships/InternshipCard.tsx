import React from 'react';
import { MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react';
import { Internship } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface InternshipCardProps {
  internship: Internship;
  onViewDetails: (internship: Internship) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({ 
  internship, 
  onViewDetails 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card hover className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {internship.title}
            </h3>
            <p className="text-lg text-blue-600 font-medium">
              {internship.company}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            internship.locationType === 'Remote' 
              ? 'bg-green-100 text-green-800'
              : internship.locationType === 'Hybrid'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {internship.locationType}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{internship.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{internship.duration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium text-green-600">
              {internship.stipend}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{internship.applicationCount} applicants</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Deadline: {formatDate(internship.deadline)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 text-sm line-clamp-3">
            {internship.description}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {internship.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {internship.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                +{internship.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(internship)}
          className="w-full"
        >
          View Details & Apply
        </Button>
      </CardContent>
    </Card>
  );
};