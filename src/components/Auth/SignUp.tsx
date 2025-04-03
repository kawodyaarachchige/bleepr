import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MailIcon, LockIcon, MessageCircleIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpProps {
  onToggleForm: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      await signup(email, password);
    } catch (error: any) {
      setError(error.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Card className="w-full border-0 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="space-y-1 px-6 py-6">
          <div className="flex items-center justify-center mb-4">
            <MessageCircleIcon className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold ml-2">Create Account</CardTitle>
          </div>
          <CardDescription className="text-center text-muted-foreground">
            Sign up to start chatting with others
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10"
                    required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-10"
                    required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-10"
                    required
                />
              </div>
            </div>

            <Button
                type="submit"
                className="w-full h-10"
                disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button
                  variant="link"
                  onClick={onToggleForm}
                  className="p-0 text-sm font-semibold hover:underline"
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
  );
};