import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign } from 'lucide-react';
import { Internship } from '../types';
import { INTERNSHIP_ROLES } from '../utils/constants';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';
import { InternshipCard } from '../components/internships/InternshipCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingSpinner';

export const InternshipListingPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState('');

  const roleData = INTERNSHIP_ROLES.find(r => r.id === role);

  const { data: internships, loading, error } = useApi<Internship[]>(
    () => apiService.getInternshipsByRole(role!),
    [role]
  );

  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);

  useEffect(() => {
    if (!internships) return;

    let filtered = [...internships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(internship =>
        internship.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Location type filter
    if (locationTypeFilter) {
      filtered = filtered.filter(internship =>
        internship.locationType === locationTypeFilter
      );
    }

    setFilteredInternships(filtered);
  }, [internships, searchTerm, locationFilter, locationTypeFilter]);

  const handleViewDetails = (internship: Internship) => {
    navigate(`/internship/${internship.id}`);
  };

  if (!roleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Role Not Found</h1>
          <Button onClick={() => navigate('/roles')}>
            Browse All Roles
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading internships..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Internships</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <span 
              onClick={() => navigate('/roles')}
              className="hover:text-blue-600 cursor-pointer"
            >
              All Roles
            </span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{roleData.title}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {roleData.title} Positions
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {roleData.description}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={locationTypeFilter}
              onChange={(e) => setLocationTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Internship Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredInternships.length === 0 && internships && internships.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No internships match your filters
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria to see more results.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setLocationTypeFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};