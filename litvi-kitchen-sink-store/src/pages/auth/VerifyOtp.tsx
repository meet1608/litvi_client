import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const token = location.state?.token;
  
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setCountdown(parseInt(localStorage.getItem("otpCountdown")) || 30);
  
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCountdown = prev - 1;
          localStorage.setItem("otpCountdown", newCountdown.toString());
          if (newCountdown <= 0) {
            clearInterval(timer);
            localStorage.removeItem("otpCountdown");
          }
          return newCountdown;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [token]);
  

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://litvi-client.onrender.com/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, token }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "OTP Verified Successfully",
        });
        console.log("OTP Verified Successfully", data);
        localStorage.removeItem("otpCountdown");
        navigate(`/auth/reset-password/${token}`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to verify OTP",
          variant: "destructive",
        });
        console.error("Error:", data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Request failed. Please try again.",
        variant: "destructive",
      });
      console.error("Request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    // Remove old token before requesting a new one
    localStorage.removeItem("token");
  
    try {
      const response = await fetch("https://litvi-client.onrender.com/auth/send-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok && data.token) {
        // Store the new token
        localStorage.setItem("token", data.token);
        
        toast({ title: "Success", description: "A new OTP has been sent to your email" });
        setCountdown(30);
        localStorage.setItem("otpCountdown", "30");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to resend OTP",
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
          <h1 className="mt-6 text-3xl font-bold text-white">Verify OTP</h1>
          <p className="mt-2 text-sm text-white/70">
            Enter the verification code sent to your email
          </p>
        </div>
        
        <div className="bg-litvi-darkCharcoal border border-white/10 rounded-lg p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-litvi-purple/20 mb-3">
              <Mail className="h-6 w-6 text-litvi-purple" />
            </div>
            <p className="text-white mb-1">OTP sent to</p>
            <p className="text-white font-medium">{email || "your email"}</p>
          </div>
          
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-white/90">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="text-center text-lg tracking-widest bg-litvi-dark border-white/10 text-white"
                required
                maxLength={6}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || !otp}
              className="w-full bg-gradient-to-r from-litvi-purple to-litvi-magenta hover:opacity-90"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Verify OTP
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70 mb-3">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={countdown > 0}
              className="w-full border-white/20 text-white hover:bg-litvi-purple/20"
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </Button>
            
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default VerifyOtp;