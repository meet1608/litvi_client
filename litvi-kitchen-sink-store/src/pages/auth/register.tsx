import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!username || !email || !password || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      setIsLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('https://litvi-client.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setShowOtpField(true);
        toast({ title: "Success", description: "OTP sent to your email" });
      } else {
        toast({ title: "Error", description: data.message || "Registration failed", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('https://litvi-client.onrender.com/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Success", description: "Account created successfully! Please log in." });
        navigate('/auth/login');
      } else {
        toast({ title: "Error", description: data.message || "OTP verification failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
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
          <h1 className="mt-6 text-3xl font-bold text-white">Create an account</h1>
          <p className="mt-2 text-sm text-white/70">Sign up to get started</p>
        </div>

        <div className="bg-litvi-darkCharcoal border border-white/10 rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-white/90">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 bg-litvi-dark border-white/10 text-white"
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-10 bg-litvi-dark border-white/10 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 bg-litvi-dark border-white/10 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {showOtpField && (
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-white/90">
                  OTP
                </label>
                <div className="relative">
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="pl-10 bg-litvi-dark border-white/10 text-white"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type={showOtpField ? "button" : "submit"}
              onClick={showOtpField ? handleVerifyOtp : undefined}
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-litvi-purple to-litvi-magenta hover:opacity-90"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {showOtpField ? "Verifying OTP..." : "Creating account..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {showOtpField ? "Verify OTP" : "Sign Up"}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-litvi-purple hover:text-litvi-magenta font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;