
type RazorpayOptions = {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    notes: {
      [key: string]: string;
    };
    theme: {
      color: string;
    };
  };
  
  declare global {
    interface Window {
      Razorpay: new (options: RazorpayOptions) => {
        open: () => void;
      };
    }
  }
  
  export const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(window.Razorpay);
      };
      script.onerror = () => {
        resolve(null);
      };
      document.body.appendChild(script);
    });
  };