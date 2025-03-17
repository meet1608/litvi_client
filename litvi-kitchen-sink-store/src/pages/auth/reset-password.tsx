import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { validatePasswordReset } from '@/utiles/formValidation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const tokenParam = localStorage.getItem("token");

  useEffect(() => {
    // Extract token from URL query params
    // const queryParams = new URLSearchParams(location.search);
    // const tokenParam = queryParams.get('token');
    
    if (!tokenParam) {
      setError('Invalid or missing reset token. Please request a new password reset.');
      return;
    }
    
    setToken(tokenParam);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Error", description: "Invalid reset token. Please request a new password reset.", variant: "destructive" });
      return;
    }
    const validation = validatePasswordReset(password, confirmPassword);
    if (!validation.isValid) {
      setError(validation.error);
      toast({ title: "Error", description: validation.error, variant: "destructive" });
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`https://litvi-client.onrender.com/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: "Success", description: "Your password has been reset successfully." });
        setIsSuccess(true);
        localStorage.removeItem("token"); // Remove token from localStorage
        setTimeout(() => navigate("/auth/login"), 2000);
      } else {
        setError(data.message || "Failed to reset password.");
        toast({ title: "Error", description: data.message || "Failed to reset password.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setIsLoading(false);
  };
  
  

  return (
    <div className="min-h-screen bg-litvi-dark flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 bg-litvi-purple/80 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Litvi</span>
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-white/70">
            {!isSuccess 
              ? "Enter your new password below" 
              : "Your password has been reset successfully"}
          </p>
        </div>
        
        <div className="bg-litvi-darkCharcoal border border-white/10 rounded-lg p-6 shadow-xl">
          {!token && !isSuccess && (
            <div className="text-center py-6">
              <p className="text-red-400 mb-4">{error}</p>
              <Link to="/auth/forgot-password">
                <Button 
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-litvi-purple/20"
                >
                  Back to Forgot Password
                </Button>
              </Link>
            </div>
          )}
          
          {token && !isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="pl-10 bg-litvi-dark border-white/10 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="pl-10 bg-litvi-dark border-white/10 text-white"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-litvi-purple to-litvi-magenta hover:opacity-90"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
          
          {isSuccess && (
            <div className="text-center py-4">
              <div className="mb-4 flex justify-center">
                <Check className="h-12 w-12 text-litvi-purple" />
              </div>
              <p className="text-white text-lg font-medium mb-2">
                Password Reset Successful
              </p>
              <p className="text-sm text-white/70 mb-6">
                Your password has been reset successfully. You will be redirected to the login page.
              </p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Remember your password?{' '}
              <Link to="/auth/login" className="text-litvi-purple hover:text-litvi-magenta font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;