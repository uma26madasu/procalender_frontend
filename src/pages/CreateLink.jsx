import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api';

// Form validation schema
const linkSchema = z.object({
  meetingName: z.string().min(1, "Meeting name is required"),
  meetingLength: z.number().min(15, "Meeting must be at least 15 minutes"),
  maxAdvanceDays: z.number().min(1, "Must allow at least 1 day in advance"),
  usageLimit: z.number().optional(),
  expirationDate: z.string().optional(),
});

export default function CreateLink() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([{ id: 'q1', label: 'What topics would you like to discuss?' }]);
  const [newQuestion, setNewQuestion] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      meetingName: '',
      meetingLength: 30,
      maxAdvanceDays: 14,
      usageLimit: 0, // 0 means unlimited
      expirationDate: '',
    }
  });

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { id: `q${questions.length + 1}`, label: newQuestion }]);
      setNewQuestion('');
    }
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, newLabel) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, label: newLabel } : q));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Add questions to form data
      data.questions = questions;
      
      // Format date properly if exists
      if (data.expirationDate) {
        data.expirationDate = new Date(data.expirationDate).toISOString();
      }
      
      const response = await apiService.createLink(data);
      
      if (response.success) {
        setSuccessData({
          linkId: response.linkId,
          linkUrl: response.linkUrl
        });
      } else {
        setError(response.message || 'Failed to create scheduling link');
      }
    } catch (err) {
      setError('Error creating scheduling link. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };

  if (successData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-500 mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Created Successfully!</h2>
          <p className="text-gray-600 mb-6">Share this link with your clients to allow them to schedule meetings with you.</p>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-md flex items-center">
            <input
              type="text"
              value={successData.linkUrl}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
            />
            <button
              onClick={() => copyToClipboard(successData.linkUrl)}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
          
          <div className="mt-6 flex space-x-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => setSuccessData(null)}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700"
            >
              Create Another Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Scheduling Link</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="meetingName" className="block text-sm font-medium text-gray-700">
            Meeting Name
          </label>
          <input
            id="meetingName"
            type="text"
            {...register('meetingName')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g. Initial Consultation"
          />
          {errors.meetingName && (
            <p className="mt-1 text-sm text-red-600">{errors.meetingName.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="meetingLength" className="block text-sm font-medium text-gray-700">
              Meeting Length (minutes)
            </label>
            <select
              id="meetingLength"
              {...register('meetingLength', { valueAsNumber: true })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
            {errors.meetingLength && (
              <p className="mt-1 text-sm text-red-600">{errors.meetingLength.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="maxAdvanceDays" className="block text-sm font-medium text-gray-700">
              Max Days in Advance
            </label>
            <input
              id="maxAdvanceDays"
              type="number"
              {...register('maxAdvanceDays', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="1"
              max="365"
            />
            {errors.maxAdvanceDays && (
              <p className="mt-1 text-sm text-red-600">{errors.maxAdvanceDays.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
              Usage Limit (0 for unlimited)
            </label>
            <input
              id="usageLimit"
              type="number"
              {...register('usageLimit', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
            />
            {errors.usageLimit && (
              <p className="mt-1 text-sm text-red-600">{errors.usageLimit.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
              Expiration Date (optional)
            </label>
            <input
              id="expirationDate"
              type="date"
              {...register('expirationDate')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.expirationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Custom Questions</h2>
            <span className="text-xs text-gray-500">These will be asked to clients when they book</span>
          </div>
          
          <div className="mt-2 space-y-3">
            {questions.map((question) => (
              <div key={question.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={question.label}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter question"
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-3 flex">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Add a new question"
            />
            <button
              type="button"
              onClick={addQuestion}
              disabled={!newQuestion.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="pt-5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Link'}
          </button>
        </div>
      </form>
    </div>
  );
}