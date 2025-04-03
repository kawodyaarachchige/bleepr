import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MailIcon, LockIcon, LogInIcon } from 'lucide-react';
interface LoginProps {
  onToggleForm: () => void;
}
export const Login: React.FC<LoginProps> = ({
  onToggleForm
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-gray-600">Log in to continue to Chat App</p>
      </div>
      {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
          {error}
        </div>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MailIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="••••••••" />
            </div>
          </div>
        </div>
        <div>
          <button type="submit" disabled={loading} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {loading ? 'Logging in...' : <>
                <LogInIcon className="w-5 h-5 mr-2" />
                Log in
              </>}
          </button>
        </div>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button onClick={onToggleForm} className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </button>
        </p>
      </div>
    </div>;
};