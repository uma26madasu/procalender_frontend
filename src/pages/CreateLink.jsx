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
  questions: z.array(
    z.object({
      label: z.string().min(1, "Question text is required")
    })
  ).optional()
});

export default function CreateLink() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([{ label: '' }]);
  const [newQuestion, setNewQuestion] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      meetingName: '',
      meetingLength: 30,
      maxAdvanceDays: 14,
      usageLimit: 0, // 0 means unlimited
      expirationDate: '',
      questions: [{ label: 'What topics would you like to discuss?' }]
    }
  });

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { label: newQuestion }]);
      setNewQuestion('');
    }
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Add questions from state to form data
      data.questions = questions;
      
      // Format date properly if exists
      if (data.expirationDate) {
        data.expirationDate = new Date(data.expirationDate).toISOString();
      }
      
      const response = await apiService.createLink(data);
      
      if (response.success) {
        setSuccessMessage(`Scheduling link created successfully! Link: ${response.linkUrl}`);
        // Could navigate to link details or copy to clipboard
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Scheduling Link</h1>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Name
          </label>
          <input
            type="text"
            {...register('meetingName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g. Initial Consultation"
          />
          {errors.meetingName && (
            <p className="mt-1 text-sm text-red-600">{errors.meetingName.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Length (minutes)
            </label>
            <select
              {...register('meetingLength', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Days in Advance
            </label>
            <input
              type="number"
              {...register('maxAdvanceDays', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              max="365"
            />
            {errors.maxAdvanceDays && (
              <p className="mt-1 text-sm text-red-600">{errors.maxAdvanceDays.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Limit (0 for unlimited)
            </label>
            <input
              type="number"
              {...register('usageLimit', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
            />
            {errors.usageLimit && (
              <p className="mt-1 text-sm text-red-600">{errors.usageLimit.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date (optional)
            </label>
            <input
              type="date"
              {...register('expirationDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.expirationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Questions
          </label>
          
          {questions.map((question, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={question.label}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].label = e.target.value;
                  setQuestions(updatedQuestions);
                }}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter question"
              />
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md"
                disabled={questions.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="flex mt-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Add a new question"
            />
            <button
              type="button"
              onClick={addQuestion}
              className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md"
              disabled={!newQuestion.trim()}
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Scheduling Link'}
          </button>
        </div>
      </form>
    </div>
  );
}