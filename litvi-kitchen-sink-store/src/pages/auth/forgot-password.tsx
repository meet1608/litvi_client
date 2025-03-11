import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("https://litvi-client.onrender.com/auth/send-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include", // Ensure cookies are sent if needed
      });
  
      const data = await response.json();
  
      if (response.ok && data.token) {
        toast({ title: "Success", description: data.message });
        navigate("/auth/verify-otp", { state: { email, token: data.token } });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
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
            {!isSubmitted
              ? "Enter your email and we'll send you instructions to reset your password"
              : "Check your email for reset instructions"}
          </p>
        </div>

        <div className="bg-litvi-darkCharcoal border border-white/10 rounded-lg p-6 shadow-xl">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
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
                    Sending instructions...
                  </span>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <p className="text-white mb-4">
                Reset instructions have been sent to <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-white/70 mb-6">
                Please check your email inbox and spam folder. The link will be valid for 30 minutes.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full border-white/20 text-white hover:bg-litvi-purple/20"
              >
                Send again
              </Button>
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

export default ForgotPassword;
