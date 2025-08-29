import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, Calendar, Building, ArrowLeft, CheckCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { LoadingState } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { ApplicationForm } from '../components/application/ApplicationForm';

export const InternshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const { data: internship, loading, error } = useApi(
    () => apiService.getInternshipById(id!),
    [id]
  );

  if (loading) {
    return <LoadingState message="Loading internship details..." />;
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Internship Not Found</h1>
          <p className="text-gray-600 mb-4">The internship you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/roles')}>
            Browse All Internships
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleApplicationComplete = (appId: string) => {
    console.log("form is submitted")
    console.log(appId)
    setApplicationId(appId);
    setShowApplicationForm(false);
    setApplicationSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to listings
        </button>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {internship.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-lg">
                    <div className="flex items-center text-blue-600 font-semibold">
                      <Building className="h-5 w-5 mr-2" />
                      {internship.company}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      internship.locationType === 'Remote' 
                        ? 'bg-green-100 text-green-800'
                        : internship.locationType === 'Hybrid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {internship.locationType}
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => setShowApplicationForm(true)}
                  className="ml-6"
                >
                  Apply Now
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-sm">{internship.location}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Duration</div>
                    <div className="text-sm">{internship.duration}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Stipend</div>
                    <div className="text-sm font-semibold text-green-600">{internship.stipend}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Deadline</div>
                    <div className="text-sm">{formatDate(internship.deadline)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">About This Internship</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{internship.description}</p>
            </CardContent>
          </Card>

          {/* Requirements and Responsibilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Requirements</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {internship.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Responsibilities</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {internship.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Skills */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Required Skills</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {internship.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Stats */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{internship.applicationCount} applicants</span>
                  </div>
                  <div className="text-gray-600">
                    Posted: {formatDate(internship.posted)}
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => setShowApplicationForm(true)}
                >
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Form Modal */}
      <Modal
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        size="xl"
      >
        <ApplicationForm
          internshipId={internship.id}
          onSubmissionComplete={handleApplicationComplete}
        />
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={applicationSubmitted}
        onClose={() => setApplicationSubmitted(false)}
        title="Application Submitted Successfully!"
        size="md"
      >
        <div className="text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your application has been submitted!
          </h3>
          <p className="text-gray-600 mb-4">
            Application ID: <strong>{applicationId}</strong>
          </p>
          <p className="text-gray-600 mb-6">
            We've sent a confirmation email with your application details. 
            You'll hear back from us within 5-7 business days.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/roles')}
              className="w-full"
            >
              Browse More Internships
            </Button>
            <Button
              variant="outline"
              onClick={() => setApplicationSubmitted(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};