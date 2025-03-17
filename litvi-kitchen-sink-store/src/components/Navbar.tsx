import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cartContext'; // Make sure the path is correct
import { FaUserCircle } from 'react-icons/fa';

const navigation = [

];

const Navbar = () => {
  const { getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'neo-blur backdrop-blur-xl' : 'bg-transparent'
        } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a onClick={() => navigate('/')} className="flex items-center gap-2 select-none cursor-pointer">
              <motion.div
                className="w-10 h-10 bg-litvi-purple/80 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-bold text-lg">L</span>
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-white">Litvi</span>
            </a>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item, index) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="text-sm font-medium flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <motion.a
                    href={item.href}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {item.name}
                  </motion.a>
                )}

                {item.hasDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="neo-blur rounded-md shadow-lg py-2 border border-white/10">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-white/80 hover:bg-litvi-purple/20 hover:text-white transition-colors"
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 px-3 py-2 bg-litvi-purple/80 text-white rounded-full shadow-lg hover:bg-litvi-purple transition-all duration-300 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <ShoppingCart className="h-5 w-5" /> {/* Shopping Cart Icon */}
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0">
                  {getCartCount()}
                </span>
              )}
            </motion.button>

            <motion.button
              onClick={() => navigate("/products")}
              className="flex items-center gap-3 px-4 py-2 bg-litvi-purple/80 text-white rounded-full shadow-lg hover:bg-litvi-purple transition-all duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-semibold">Products</span>
            </motion.button>
            <motion.button
              onClick={() => navigate("/contactus")}
              className="flex items-center gap-3 px-4 py-2 bg-litvi-purple/80 text-white rounded-full shadow-lg hover:bg-litvi-purple transition-all duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-semibold">Contact Us</span>
            </motion.button>
            {user ? (
              <div className='w-24 h-24 ml-2'>
              <FaUserCircle
                className="text-white text-3xl cursor-pointer hover:text-litvi-purple transition-all duration-300"
                onClick={() => navigate('/auth/profile')}
              />
              </div>
            ) : (
              <motion.button
                onClick={() => navigate("/auth/login")}
                className="flex items-center gap-3 px-4 py-2 bg-litvi-purple/80 text-white rounded-full shadow-lg hover:bg-litvi-purple transition-all duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm font-semibold">Login</span>
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden neo-blur"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-litvi-purple/20 transition-colors"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''
                          }`} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4"
                          >
                            {item.dropdownItems?.map((dropdownItem) => (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="block px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-litvi-purple/20 transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                {dropdownItem.name}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-litvi-purple/20 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}

              {/* Cart and Login buttons for mobile */}
              <div className="pt-4 space-y-2">
                <motion.button
                  onClick={() => {
                    navigate("/cart");
                    if (setIsOpen) {
                      setIsOpen(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-litvi-purple/80 text-white rounded-md shadow-lg hover:bg-litvi-purple transition-all duration-300 relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <ShoppingCart className="h-5 w-5" /> {/* ShoppingCart Icon */}
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0">
                      {getCartCount()}
                    </span>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate("/products");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-litvi-purple/80 text-white rounded-md shadow-lg hover:bg-litvi-purple transition-all duration-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-semibold">Products</span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate("/contactus");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-litvi-purple/80 text-white rounded-md shadow-lg hover:bg-litvi-purple transition-all duration-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-semibold">Contact Us</span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate("/auth/login");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-litvi-purple/80 text-white rounded-md shadow-lg hover:bg-litvi-purple transition-all duration-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-semibold">Login</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
