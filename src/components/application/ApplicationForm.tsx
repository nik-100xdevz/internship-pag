import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, FileText, Check } from 'lucide-react';
import { ApplicationFormData, applicationSchema } from '../../schemas';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAsyncOperation } from '../../hooks/useApi';
import { apiService } from '../../services/api';

interface ApplicationFormProps {
  internshipId: string;
  onSubmissionComplete: (applicationId: string) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  internshipId,
  onSubmissionComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [resumeLink, setResumeLink] = useState<string>('');
  const { execute, loading } = useAsyncOperation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      internshipId,
      experience: {
        hasExperience: false,
      },
    },
  });

  const hasExperience = watch('experience.hasExperience');

  // Step titles updated to match the screenshots you provided
  const steps = [
    'Personal Info',
    'Education',
    'Skills',
    'Resume Link',
    'Submit',
  ];

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      const result = await execute(async () => {
        // Ensure resume info is passed either as file or link
        const payload: any = {
          ...data,
          resume: resumeFile,
          resumeLink: resumeLink || undefined,
          portfolio: portfolioFile,
        };
        return await apiService.submitApplication(payload);
      });

      onSubmissionComplete(result.data.applicationId);
    } catch (error) {
      console.error('Application submission failed:', error);
    }
  };

  const handleFileUpload = (file: File, type: 'resume' | 'portfolio') => {
    if (type === 'resume') {
      setResumeFile(file);
      // if user uploads file, clear any resume link
      setResumeLink('');
    } else {
      setPortfolioFile(file);
    }
  };

  const handleResumeLinkChange = (value: string) => {
    setResumeLink(value);
    // if user provides a link, clear uploaded file
    if (value) setResumeFile(null);
  };

  const isValidUrl = (value: string) => {
    try {
      // basic URL validation
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Ensure resume requirement: either file or valid link
  const hasResumeProvided = Boolean(resumeFile) || (resumeLink && isValidUrl(resumeLink));

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                placeholder="John" 
                error={errors.firstName?.message} 
                {...register('firstName')} 
              />
              <Input 
                label="Last Name" 
                placeholder="Doe" 
                error={errors.lastName?.message} 
                {...register('lastName')} 
              />
            </div>

            <Input 
              label="Email Address" 
              type="email" 
              placeholder="john@example.com" 
              error={errors.email?.message} 
              {...register('email')} 
            />
            
            <Input 
              label="Phone Number" 
              type="tel" 
              placeholder="+91 12345-67890" 
              error={errors.phone?.message} 
              {...register('phone')} 
            />

            <Input 
              label="Date of Birth" 
              type="date" 
              error={errors.dateOfBirth?.message} 
              {...register('dateOfBirth')} 
            />

            <Textarea 
              label="Address" 
              placeholder="Your full address" 
              rows={2} 
              error={errors.address?.message} 
              {...register('address')} 
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                label="City" 
                placeholder="Mumbai" 
                error={errors.city?.message} 
                {...register('city')} 
              />
              <Input 
                label="State" 
                placeholder="Maharashtra" 
                error={errors.state?.message} 
                {...register('state')} 
              />
              <Input 
                label="ZIP Code" 
                placeholder="400001" 
                error={errors.zipCode?.message} 
                {...register('zipCode')} 
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Degree" 
                placeholder="Bachelor's, Master's, etc." 
                error={errors.education?.degree?.message} 
                {...register('education.degree')} 
              />
              <Input 
                label="Field of Study" 
                placeholder="Computer Science, IT, etc." 
                error={errors.education?.field?.message} 
                {...register('education.field')} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="University / College" 
                placeholder="University name" 
                error={errors.education?.university?.message} 
                {...register('education.university')} 
              />
              <Input 
                label="Graduation Year" 
                placeholder="2024" 
                error={errors.education?.graduationYear?.message} 
                {...register('education.graduationYear')} 
              />
            </div>

            <Input 
              label="GPA (Optional)" 
              placeholder="8.5/10 or 3.8/4.0" 
              error={errors.education?.gpa?.message} 
              {...register('education.gpa')} 
            />

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  id="hasExperience" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  {...register('experience.hasExperience')} 
                />
                <label htmlFor="hasExperience" className="text-sm font-medium text-gray-700">
                  I have relevant work experience or internships
                </label>
              </div>

              {hasExperience && (
                <Textarea 
                  label="Previous Internships / Work Experience" 
                  placeholder="Describe your previous internships or work experience..." 
                  rows={3} 
                  error={errors.experience?.previousInternships?.message} 
                  {...register('experience.previousInternships')} 
                />
              )}

              <Textarea 
                label="Projects" 
                placeholder="Describe any relevant projects you've worked on..." 
                rows={3} 
                error={errors.experience?.projects?.message} 
                {...register('experience.projects')} 
              />

              <Textarea 
                label="Relevant Skills" 
                placeholder="Describe your technical skills and expertise..." 
                rows={4} 
                error={errors.experience?.skills?.message} 
                {...register('experience.skills')} 
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>

            <Textarea 
              label="Cover Letter" 
              placeholder="Write a brief cover letter explaining your interest and qualifications..." 
              rows={6} 
              error={errors.coverLetter?.message} 
              {...register('coverLetter')} 
            />

            <Textarea 
              label="Why are you interested in this internship?" 
              placeholder="Tell us what motivates you to apply for this position..." 
              rows={4} 
              error={errors.whyInterested?.message} 
              {...register('whyInterested')} 
            />

            <Input 
              label="Availability" 
              placeholder="Full-time, Part-time, Weekends, etc." 
              error={errors.availability?.message} 
              {...register('availability')} 
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume & Portfolio</h3>

            <p className="text-sm text-gray-600">You can either upload your resume file or provide a Google Drive / shareable link. We accept both — but please provide at least one.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume (Upload file)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'resume');
                    }}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">
                      {resumeFile ? (
                        <span className="text-green-600 flex items-center justify-center">
                          <Check className="h-4 w-4 mr-1" />
                          {resumeFile.name}
                        </span>
                      ) : (
                        <>Click to upload or drag and drop your resume</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or Provide Google Drive / Shareable Link</label>
                <Input
                  placeholder="https://drive.google.com/your-shared-link"
                  value={resumeLink}
                  onChange={(e) => handleResumeLinkChange(e.target.value)}
                  error={resumeLink && !isValidUrl(resumeLink) ? 'Please enter a valid URL' : undefined}
                />
                <p className="text-xs text-gray-500 mt-1">Make sure the link is public / anyone with the link can view.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio (Optional upload)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.zip,.rar"
                    className="hidden"
                    id="portfolio-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'portfolio');
                    }}
                  />
                  <label htmlFor="portfolio-upload" className="cursor-pointer">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">
                      {portfolioFile ? (
                        <span className="text-green-600 flex items-center justify-center">
                          <Check className="h-4 w-4 mr-1" />
                          {portfolioFile.name}
                        </span>
                      ) : (
                        <>Upload your portfolio (optional)</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, ZIP up to 25MB</p>
                  </label>
                </div>
              </div>
            </div>

            {!hasResumeProvided && (
              <p className="text-sm text-red-600">Please upload a resume or provide a valid Google Drive link before proceeding.</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-4">Please review your application before submitting. You can go back to make changes if needed.</p>

              <div className="space-y-3 text-sm">
                <div><strong>Name:</strong> {watch('firstName')} {watch('lastName')}</div>
                <div><strong>Email:</strong> {watch('email')}</div>
                <div><strong>Phone:</strong> {watch('phone')}</div>
                <div><strong>University:</strong> {watch('education.university')}</div>
                <div><strong>Degree:</strong> {watch('education.degree')} in {watch('education.field')}</div>
                <div><strong>Graduation Year:</strong> {watch('education.graduationYear')}</div>
                <div><strong>Resume:</strong> {resumeFile ? resumeFile.name : resumeLink ? resumeLink : 'Not provided'}</div>
                <div><strong>Portfolio:</strong> {portfolioFile ? portfolioFile.name : 'Not provided'}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                {...register('termsAccepted')} 
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the Terms and Conditions and Privacy Policy. I understand that my application will be reviewed and I may be contacted for interviews.
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-red-600 mt-2">{errors.termsAccepted.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const validateStep = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address', 'city', 'state', 'zipCode'];
        break;
      case 1:
        fieldsToValidate = ['education.degree', 'education.field', 'education.university', 'education.graduationYear', 'experience.skills'];
        break;
      case 2:
        fieldsToValidate = ['coverLetter', 'whyInterested', 'availability'];
        break;
      case 3:
        // Resume validation handled separately
        return hasResumeProvided;
      default:
        return true;
    }

    const isValid = await trigger(fieldsToValidate as any);
    return isValid;
  };
console.log('this is error',errors)
  const handleNext = async () => {
    const isValid = await validateStep();
    console.log('this is validation',isValid)
    if (isValid) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Unpaid Internship Application</h2>
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step Labels */}
          <div className="flex justify-between text-xs text-gray-500">
            {steps.map((step, index) => (
              <span 
                key={index} 
                className={`${index <= currentStep ? 'text-blue-600 font-medium' : ''}`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button 
                type="button" 
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                loading={loading} 
                disabled={!hasResumeProvided}
              >
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;