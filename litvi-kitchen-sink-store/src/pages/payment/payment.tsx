import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import {
    CreditCard,
    ShieldCheck,
    Truck,
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cartContext';
import { loadRazorpay } from '@/utiles/razorpay';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";
const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.userId;
const email = user?.email;

interface ShippingDetails {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    landMark: string;
    city: string;
    state: string;
    zipCode: string;
    userId: string;
}

const Payment = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        fullName: '',
        email: email || '',
        phone: '',
        address: '',
        landMark: '',
        city: '',
        state: '',
        zipCode: '',
        userId: userId || '' // Added userId
    });


    // Calculate order summary values
    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    useEffect(() => {
        // Scroll to top on page load
        window.scrollTo(0, 0);

        // Check if cart is empty, redirect to cart page if it is
        if (cartItems.length === 0) {
            navigate('/cart');
            toast.error('Your cart is empty. Please add items before proceeding to payment.');
        }
    }, [cartItems, navigate]);

    useEffect(() => {
        const savedDetails = localStorage.getItem('shippingDetails');
        if (savedDetails) {
            setShippingDetails(JSON.parse(savedDetails));
        }
    }, []);

    useEffect(() => {
        if (!shippingDetails.email) {
            setShippingDetails(prev => ({ ...prev, email }));
        }
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => {
            const updatedDetails = { ...prev, [name]: value };
            localStorage.setItem('shippingDetails', JSON.stringify(updatedDetails));
            return updatedDetails;
        });
    };



    const validateForm = (): boolean => {
        const { fullName, email, phone, address, landMark, city, state, zipCode } = shippingDetails;

        if (!fullName || !email || !phone || !address || !landMark || !city || !state || !zipCode) {
            toast.error('Please fill in all shipping details');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (!/^\d{10}$/.test(phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }

        if (!/^\d{6}$/.test(zipCode)) {
            toast.error('Please enter a valid 6-digit ZIP code');
            return false;
        }

        return true;
    };

    const handlePayment = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            // Save Shipping Details
            const dataToSend = { ...shippingDetails };

            const response = await axios.post('https://litvi-client.onrender.com/api/shipping/save-shipping', dataToSend);
    
            if (response.status !== 201) {
                toast.error("Error", {
                    description: response.data?.message || "Failed to save shipping details."
                });
                setLoading(false);
                return;
            }


            // Proceed with payment
            if (paymentMethod === 'card') {
                const razorpay = await loadRazorpay();

                if (!razorpay) {
                    toast.error('Razorpay SDK failed to load. Please try again later.');
                    setLoading(false);
                    return;
                }

                const orderData = {
                    amount: Math.round(total * 100),
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                    payment_capture: 1
                };

                const order = {
                    id: `order_${Date.now()}`,
                    amount: orderData.amount
                };

                const options = {
                    key: 'rzp_test_YOUR_KEY_ID',
                    amount: order.amount,
                    currency: 'INR',
                    name: 'LITVI Quartz',
                    description: 'Purchase of Quartz Sinks',
                    order_id: order.id,
                    handler: function (response) {
                        handlePaymentSuccess(response);
                    },
                    prefill: {
                        name: shippingDetails.fullName,
                        email: shippingDetails.email,
                        contact: shippingDetails.phone
                    },
                    notes: {
                        address: shippingDetails.address,
                        landmark: shippingDetails.landMark,
                    },
                    theme: {
                        color: '#8B5CF6'
                    }
                };

                const paymentObject = new razorpay(options);
                paymentObject.open();
            } else {
                setTimeout(() => {
                    handlePaymentSuccess({
                        razorpay_payment_id: `cod_${Date.now()}`,
                        razorpay_order_id: `order_${Date.now()}`,
                        razorpay_signature: 'cod_signature'
                    });
                }, 2000);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again later.');
            setLoading(false);
        }
    };


    const handlePaymentSuccess = (response: any) => {
        // Simulate order processing
        setTimeout(() => {
            setLoading(false);

            // Clear cart
            clearCart();

            // Show success toast
            toast.success('Payment successful! Your order has been placed.');

            // Redirect to success page or home
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-litvi-dark text-white">
            <Navbar />

            <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <div className="flex items-center gap-x-2 mb-8">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/cart')}
                            className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-3xl font-bold">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Shipping & Payment Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shipping Information */}
                            <div className="neo-blur backdrop-blur-sm rounded-lg border border-white/10 p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <MapPin className="mr-2 h-5 w-5 text-litvi-purple" />
                                    Shipping Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="fullName" className="text-sm text-white/70">
                                            Full Name
                                        </label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={shippingDetails.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm text-white/70">
                                            Email Address
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}  // Email from localStorage
                                            readOnly
                                            className="bg-white/5 border-white/10 text-white cursor-not-allowed"
                                        />

                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm text-white/70">
                                            Phone Number
                                        </label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={shippingDetails.phone}
                                            onChange={handleInputChange}
                                            placeholder="10-digit mobile number"
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="address" className="text-sm text-white/70">
                                            Address
                                        </label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={shippingDetails.address}
                                            onChange={handleInputChange}
                                            placeholder="Street address"
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="landmark" className="text-sm text-white/70">
                                            Landmark
                                        </label>
                                        <Input
                                            id="landmark"
                                            name="landMark"
                                            value={shippingDetails.landMark}
                                            onChange={handleInputChange}
                                            placeholder="Nearby landmark"
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>


                                    <div className="space-y-2">
                                        <label htmlFor="city" className="text-sm text-white/70">
                                            City
                                        </label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={shippingDetails.city}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="state" className="text-sm text-white/70">
                                            State
                                        </label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={shippingDetails.state}
                                            onChange={handleInputChange}
                                            placeholder="State"
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="zipCode" className="text-sm text-white/70">
                                            ZIP Code
                                        </label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            value={shippingDetails.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="6-digit PIN code"
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="neo-blur backdrop-blur-sm rounded-lg border border-white/10 p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <CreditCard className="mr-2 h-5 w-5 text-litvi-purple" />
                                    Payment Method
                                </h2>

                                <div className="space-y-4">
                                    <div
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'card'
                                            ? 'border-litvi-purple bg-litvi-purple/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'card' ? 'border-litvi-purple' : 'border-white/30'
                                                }`}>
                                                {paymentMethod === 'card' && (
                                                    <div className="w-3 h-3 rounded-full bg-litvi-purple"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">Pay with Razorpay</span>
                                                    <img
                                                        src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg"
                                                        alt="Razorpay"
                                                        className="h-6"
                                                    />
                                                </div>
                                                <p className="text-sm text-white/70 mt-1">
                                                    Credit/Debit Card, UPI, NetBanking, Wallets
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'cod'
                                            ? 'border-litvi-purple bg-litvi-purple/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-litvi-purple' : 'border-white/30'
                                                }`}>
                                                {paymentMethod === 'cod' && (
                                                    <div className="w-3 h-3 rounded-full bg-litvi-purple"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-medium">Cash on Delivery</span>
                                                <p className="text-sm text-white/70 mt-1">
                                                    Pay when your order is delivered
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 text-sm text-white/70 flex items-start">
                                    <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <p>
                                        By proceeding, you agree to our Terms of Service and Privacy Policy.
                                        All payments are secured with industry-standard encryption.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="neo-blur backdrop-blur-sm rounded-lg border border-white/10 p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-white/70">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white/70">
                                        <span>Shipping</span>
                                        <span>
                                            {shipping === 0 ? (
                                                <span className="text-green-400">Free</span>
                                            ) : (
                                                `₹${shipping.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-white/70">
                                        <span>GST (18%)</span>
                                        <span>₹{tax.toFixed(2)}</span>
                                    </div>
                                    <Separator className="bg-white/10 my-2" />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        className="w-full bg-gradient-to-r from-litvi-purple to-litvi-magenta hover:opacity-90 py-6"
                                        onClick={handlePayment}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <span className="flex items-center">
                                                {paymentMethod === 'card' ? (
                                                    <>
                                                        <CreditCard className="mr-2 h-4 w-4" />
                                                        Pay with Razorpay
                                                    </>
                                                ) : (
                                                    <>
                                                        <Truck className="mr-2 h-4 w-4" />
                                                        Place Order (COD)
                                                    </>
                                                )}
                                            </span>
                                        )}
                                    </Button>

                                    <div className="flex items-center justify-center">
                                        <ShieldCheck className="h-4 w-4 text-green-400 mr-2" />
                                        <span className="text-white/70 text-sm">
                                            Secure payment processing
                                        </span>
                                    </div>
                                </div>

                                {/* Order items summary */}
                                <div className="mt-6">
                                    <Separator className="bg-white/10 mb-4" />
                                    <h3 className="font-medium text-sm mb-3">Order Items ({cartItems.length})</h3>

                                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex items-center">
                                                <div className="h-10 w-10 rounded bg-white/10 overflow-hidden mr-3">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between">
                                                        <p className="text-sm truncate">{item.name}</p>
                                                        <p className="text-sm font-medium ml-2">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default Payment;