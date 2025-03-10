
export interface ValidationResult {
    isValid: boolean;
    errors: {
      name?: string;
      email?: string;
      message?: string;
    };
  }
  
  export const validateContactForm = (
    name: string,
    email: string,
    message: string
  ): ValidationResult => {
    const errors: ValidationResult["errors"] = {};
    let isValid = true;
  
    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
  
    // Message validation
    if (!message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    } else if (message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
      isValid = false;
    }
  
    return { isValid, errors };
  };
  
  export const validatePasswordReset = (
    password: string,
    confirmPassword: string
  ): { isValid: boolean; error: string } => {
    // Password validation
    if (!password) {
      return { isValid: false, error: "Password is required" };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: "Password must be at least 8 characters long" };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: "Password must contain at least one uppercase letter" };
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return { isValid: false, error: "Password must contain at least one number" };
    }
    
    // Check for password match
    if (password !== confirmPassword) {
      return { isValid: false, error: "Passwords do not match" };
    }
    
    return { isValid: true, error: "" };
  };
  
  export const submitContactForm = async (formData: {
    name: string;
    email: string;
    message: string;
  }) => {
    // This would normally be an API call to submit the form
    // Simulating an API call with a timeout
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Thank you for your enquiry! We'll get back to you shortly.",
        });
      }, 1500);
    });
  };