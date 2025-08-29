import React from 'react';
import { Search, Filter } from 'lucide-react';
import { INTERNSHIP_ROLES } from '../utils/constants';
import { RoleCard } from '../components/roles/RoleCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const RoleSelectionPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredRoles, setFilteredRoles] = React.useState(INTERNSHIP_ROLES);

  React.useEffect(() => {
    if (!searchTerm) {
      setFilteredRoles(INTERNSHIP_ROLES);
    } else {
      const filtered = INTERNSHIP_ROLES.filter(role =>
        role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Career Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore diverse internship opportunities across technology, business, 
            marketing, and creative fields. Find the perfect role to launch your career.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search roles by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredRoles.length} of {INTERNSHIP_ROLES.length} roles
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No roles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms to find more opportunities.
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {INTERNSHIP_ROLES.reduce((sum, role) => sum + role.count, 0)}+
              </div>
              <div className="text-gray-600">Open Positions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {INTERNSHIP_ROLES.length}
              </div>
              <div className="text-gray-600">Career Fields</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};