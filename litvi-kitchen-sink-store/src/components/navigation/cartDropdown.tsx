
import { useState, useEffect } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/cartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  
  // Add logging to debug cart functionality
  useEffect(() => {
    console.log("CartDropdown rendered with items:", cartItems);
  }, [cartItems]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        onClick={toggleCart}
        variant="ghost" 
        className="relative p-2 text-white hover:bg-litvi-purple/20"
      >
        <ShoppingCart className="h-5 w-5" />
        {getCartCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-litvi-purple text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {getCartCount()}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeCart}
            />

            {/* Cart dropdown */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
              className="neo-blur backdrop-blur-xl absolute top-12 right-0 w-80 max-h-[80vh] overflow-auto rounded-lg shadow-lg z-50 border border-white/10"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Your Cart</h3>
                <Button variant="ghost" size="icon" onClick={closeCart} className="text-white hover:bg-white/10">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-6 text-center text-white/60">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <ShoppingCart className="h-6 w-6 text-white/40" />
                  </div>
                  <p>Your cart is empty</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-white/10 text-white hover:bg-white/10"
                    onClick={() => {
                      navigate('/');
                      closeCart();
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="py-2 px-4 max-h-[40vh] overflow-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-start py-3 border-b border-white/10 last:border-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium text-white">{item.name}</h4>
                          <p className="text-sm text-white/70">${item.price.toFixed(2)}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full border-white/20 text-white p-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="text-sm text-white w-4 text-center">{item.quantity}</span>
                              
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full border-white/20 text-white p-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-white/10">
                    <div className="flex justify-between mb-4">
                      <span className="text-white/70">Total</span>
                      <span className="font-semibold text-white">${getCartTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-litvi-purple to-litvi-magenta hover:opacity-90">
                        Checkout
                      </Button>
                      <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10" onClick={closeCart}>
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartDropdown;