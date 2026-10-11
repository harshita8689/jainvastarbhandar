// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Search,
//   MessageCircle,
//   Menu,
//   X,
//   Phone,
//   ShieldCheck,
//   Sparkles,
//   ShoppingBag,
//   User,
// } from 'lucide-react';
// import { InstagramIcon } from './InstagramIcon';
// import { BUSINESS_INFO, buildGeneralWhatsAppUrl } from '../../utils/constants';
// import { useCart } from '../../context/CartContext';

// export const Navbar: React.FC = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { itemCount } = useCart();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/collection?search=${encodeURIComponent(searchTerm.trim())}`);
//       setSearchOpen(false);
//       setMobileMenuOpen(false);
//     }
//   };

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-jvb-pink-100 shadow-subtle">
//       {/* Top Announcement Bar */}
//       <div className="bg-gradient-to-r from-jvb-wine-600 via-jvb-pink-600 to-jvb-wine-600 text-white text-xs py-2 px-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-2 mx-auto sm:mx-0">
//             <Sparkles className="w-3.5 h-3.5 text-pink-200 hidden xs:inline" />
//             <span className="font-medium tracking-wide">
//               Elegance Woven Since 1977 • Pure Unstitched Ladies' Suits
//             </span>
//             <span className="hidden md:inline text-pink-200 font-light">|</span>
//             <span className="hidden md:inline text-pink-100">Gharaunda, Karnal, Haryana</span>
//           </div>
//           <div className="hidden sm:flex items-center gap-4 text-xs">
//             <a
//               href={`tel:${BUSINESS_INFO.primaryPhone}`}
//               className="hover:text-pink-200 transition-colors flex items-center gap-1"
//             >
//               <Phone className="w-3 h-3" />
//               <span>{BUSINESS_INFO.primaryPhone}</span>
//             </a>
//             <a
//               href={BUSINESS_INFO.instagramUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hover:text-pink-200 transition-colors flex items-center gap-1"
//             >
//               <InstagramIcon className="w-3 h-3" />
//               <span>{BUSINESS_INFO.instagramHandle}</span>
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Main Navbar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo Branding */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-jvb-pink-600 to-jvb-wine-700 flex flex-col items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300">
//               <span className="font-serif text-lg font-bold tracking-wider leading-none">JVB</span>
//               <span className="text-[9px] tracking-widest text-pink-200 font-medium leading-tight">1977</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-jvb-wine-700 group-hover:text-jvb-pink-600 transition-colors">
//                 Jain Vastar Bhandar
//               </span>
//               <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-jvb-pink-600">
//                 Unstitched Ladies' Suits • Est. 1977
//               </span>
//             </div>
//           </Link>

//           {/* Desktop Navigation Links */}
//           <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
//             <Link
//               to="/"
//               className={`transition-colors py-1 border-b-2 ${
//                 isActive('/')
//                   ? 'border-jvb-pink-600 text-jvb-pink-600 font-semibold'
//                   : 'border-transparent text-gray-700 hover:text-jvb-pink-600'
//               }`}
//             >
//               Home
//             </Link>
//             <Link
//               to="/collection"
//               className={`transition-colors py-1 border-b-2 ${
//                 isActive('/collection')
//                   ? 'border-jvb-pink-600 text-jvb-pink-600 font-semibold'
//                   : 'border-transparent text-gray-700 hover:text-jvb-pink-600'
//               }`}
//             >
//               All Unstitched Suits
//             </Link>
//             <Link
//               to="/collection?fabric=Pure+Cotton"
//               className="text-gray-700 hover:text-jvb-pink-600 transition-colors py-1"
//             >
             
//               About JVB
//             </Link>
//             <Link
//               to="/contact"
//               className={`transition-colors py-1 border-b-2 ${
//                 isActive('/contact')
//                   ? 'border-jvb-pink-600 text-jvb-pink-600 font-semibold'
//                   : 'border-transparent text-gray-700 hover:text-jvb-pink-600'
//               }`}
//             >
//               Contact & Store
//             </Link>
//           </nav>

//           {/* Right Action Icons & Buttons */}
//           <div className="flex items-center gap-2 sm:gap-3">
//             {/* Search Icon / Toggle */}
//             <button
//               onClick={() => setSearchOpen(!searchOpen)}
//               className="p-2 text-gray-600 hover:text-jvb-pink-600 rounded-full hover:bg-jvb-pink-50 transition-colors"
//               aria-label="Search unstitched suits"
//             >
//               <Search className="w-5 h-5" />
//             </button>

//             {/* Customer Login / Account */}
//             <Link
//               to="/login"
//               className="p-2 text-gray-600 hover:text-jvb-pink-600 rounded-full hover:bg-jvb-pink-50 transition-colors"
//               title="Customer Login / Account"
//               aria-label="Customer Account"
//             >
//               <User className="w-5 h-5" />
//             </Link>

//             {/* Shopping Cart Icon with dynamic badge */}
//             <Link
//               to="/cart"
//               className="relative p-2 text-gray-700 hover:text-jvb-pink-600 rounded-full hover:bg-jvb-pink-50 transition-colors"
//               title="Shopping Cart"
//               aria-label="Shopping Cart"
//             >
//               <ShoppingBag className="w-5 h-5" />
//               {itemCount > 0 && (
//                 <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
//                   {itemCount}
//                 </span>
//               )}
//             </Link>

//             {/* WhatsApp Direct Order Button */}
//             <a
//               href={buildGeneralWhatsAppUrl()}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
//             >
//               <MessageCircle className="w-4 h-4" />
//               <span>WhatsApp Order</span>
//             </a>

//             {/* Admin Portal Icon Link */}
//             <Link
//               to="/admin"
//               className="p-2 text-gray-400 hover:text-jvb-wine-700 rounded-full hover:bg-gray-100 transition-colors"
//               title="Admin Dashboard"
//               aria-label="Admin Portal"
//             >
//               <ShieldCheck className="w-5 h-5" />
//             </Link>

//             {/* Mobile Menu Trigger */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="lg:hidden p-2 text-gray-700 hover:text-jvb-pink-600 rounded-md focus:outline-none"
//               aria-label="Toggle menu"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Expandable Search Input Bar */}
//         {searchOpen && (
//           <div className="py-3 px-2 border-t border-gray-100 animate-fadeIn">
//             <form onSubmit={handleSearchSubmit} className="relative flex items-center">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by suit name, fabric type, or SKU code (e.g., Pure Cotton, JVB-101)..."
//                 className="w-full pl-10 pr-24 py-2.5 rounded-full border border-jvb-pink-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 text-sm bg-jvb-ivory/50"
//                 autoFocus
//               />
//               <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
//               <button
//                 type="submit"
//                 className="absolute right-1.5 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white text-xs px-4 py-1.5 rounded-full font-medium transition-colors"
//               >
//                 Search
//               </button>
//             </form>
//           </div>
//         )}
//       </div>

//       {/* Mobile Drawer Menu */}
//       {mobileMenuOpen && (
//         <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl animate-fadeIn">
//           <div className="px-4 pt-3 pb-6 space-y-2">
//             <Link
//               to="/cart"
//               onClick={() => setMobileMenuOpen(false)}
//               className="flex items-center justify-between px-3 py-2.5 rounded-md text-base font-semibold bg-rose-50 text-rose-800"
//             >
//               <span className="flex items-center gap-2">
//                 <ShoppingBag className="w-5 h-5" />
//                 Shopping Bag
//               </span>
//               <span className="bg-rose-700 text-white text-xs px-2 py-0.5 rounded-full font-bold">
//                 {itemCount}
//               </span>
//             </Link>

//             <Link
//               to="/login"
//               onClick={() => setMobileMenuOpen(false)}
//               className="flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
//             >
//               <User className="w-5 h-5 text-gray-500" />
//               Customer Login / Register
//             </Link>

//             <Link
//               to="/"
//               onClick={() => setMobileMenuOpen(false)}
//               className={`block px-3 py-2.5 rounded-md text-base font-medium ${
//                 isActive('/') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Home
//             </Link>
//             <Link
//               to="/collection"
//               onClick={() => setMobileMenuOpen(false)}
//               className={`block px-3 py-2.5 rounded-md text-base font-medium ${
//                 isActive('/collection') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               All Unstitched Suits
//             </Link>
//             <Link
//               to="/collection?fabric=Pure+Cotton"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Pure Cotton Suits
//             </Link>
//             <Link
//               to="/collection?fabric=Chanderi+Silk"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Chanderi & Silk Suits
//             </Link>
//             <Link
//               to="/about"
//               onClick={() => setMobileMenuOpen(false)}
//               className={`block px-3 py-2.5 rounded-md text-base font-medium ${
//                 isActive('/about') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               About JVB (Since 1977)
//             </Link>
//             <Link
//               to="/contact"
//               onClick={() => setMobileMenuOpen(false)}
//               className={`block px-3 py-2.5 rounded-md text-base font-medium ${
//                 isActive('/contact') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Contact & Store Location
//             </Link>
//             <Link
//               to="/admin"
//               onClick={() => setMobileMenuOpen(false)}
//               className="block px-3 py-2.5 rounded-md text-base font-medium text-jvb-wine-700 hover:bg-pink-50"
//             >
//               Admin Dashboard Portal
//             </Link>

//             <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
//               <a
//                 href={buildGeneralWhatsAppUrl()}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-medium text-sm shadow"
//               >
//                 <MessageCircle className="w-5 h-5" />
//                 <span>Order on WhatsApp (7015344280)</span>
//               </a>

//               <a
//                 href={BUSINESS_INFO.instagramUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-full flex items-center justify-center gap-2 border border-pink-300 text-jvb-pink-700 py-2.5 rounded-lg font-medium text-sm"
//               >
//                 <InstagramIcon className="w-4 h-4" />
//                 <span>Follow {BUSINESS_INFO.instagramHandle}</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  MessageCircle,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  User,
} from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { BUSINESS_INFO, buildGeneralWhatsAppUrl } from '../../utils/constants';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-jvb-pink-100 shadow-subtle">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-jvb-wine-600 via-jvb-pink-600 to-jvb-wine-600 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-pink-200 hidden xs:inline" />
            <span className="font-medium tracking-wide">
              Elegance Woven Since 1977 • Pure Unstitched Ladies' Suits
            </span>
            <span className="hidden md:inline text-pink-200 font-light">|</span>
            <span className="hidden md:inline text-pink-100">Gharaunda, Karnal, Haryana</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <a
              href={`tel:${BUSINESS_INFO.primaryPhone}`}
              className="hover:text-pink-200 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>{BUSINESS_INFO.primaryPhone}</span>
            </a>
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-200 transition-colors flex items-center gap-1"
            >
              <InstagramIcon className="w-3 h-3" />
              <span>{BUSINESS_INFO.instagramHandle}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/jvb-logo.png"
              alt="Jain Vastar Bhandar Logo"
              className="w-12 h-12 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-jvb-wine-700 group-hover:text-jvb-pink-600 transition-colors">
                Jain Vastar Bhandar
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-jvb-pink-600">
                Unstitched Ladies' Suits • Est. 1977
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors py-1 border-b-2 ${
                isActive('/')
                  ? 'border-jvb-pink-600 text-jvb-pink-600 font-semibold'
                  : 'border-transparent text-gray-700 hover:text-jvb-pink-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/collection"
              className={`transition-colors py-1 border-b-2 ${
                isActive('/collection')
                  ? 'border-jvb-pink-600 text-jvb-pink-600 font-semibold'
                  : 'border-transparent text-gray-700 hover:text-jvb-pink-600'
              }`}
            >
              All Unstitched Suits
            </Link>
            <Link
              to="/collection?fabric=Pure+Cotton"
              className="text-gray-700 hover:text-jvb-pink-600 transition-colors py-1"
            >
              About JVB
            </Link>
            <Link
              to="/contact"
              className={`transition-colors py-1 border-b-2 ${
                isActive('/contact')
                  ? 'border-jvb-pink-600 text-jvb-pink-600 font-semibold'
                  : 'border-transparent text-gray-700 hover:text-jvb-pink-600'
              }`}
            >
              Contact & Store
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon / Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-jvb-pink-600 rounded-full hover:bg-jvb-pink-50 transition-colors"
              aria-label="Search unstitched suits"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Login / Account */}
            <Link
              to="/login"
              className="p-2 text-gray-600 hover:text-jvb-pink-600 rounded-full hover:bg-jvb-pink-50 transition-colors"
              title="Customer Login / Account"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Shopping Cart Icon with dynamic badge */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-jvb-pink-600 rounded-full hover:bg-jvb-pink-50 transition-colors"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* WhatsApp Direct Order Button */}
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Order</span>
            </a>

            {/* Admin Portal Icon Link */}
            <Link
              to="/admin"
              className="p-2 text-gray-400 hover:text-jvb-wine-700 rounded-full hover:bg-gray-100 transition-colors"
              title="Admin Dashboard"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-jvb-pink-600 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-gray-100 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by suit name, fabric type, or SKU code (e.g., Pure Cotton, JVB-101)..."
                className="w-full pl-10 pr-24 py-2.5 rounded-full border border-jvb-pink-200 focus:outline-none focus:ring-2 focus:ring-jvb-pink-500 text-sm bg-jvb-ivory/50"
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white text-xs px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl animate-fadeIn">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-base font-semibold bg-rose-50 text-rose-800"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Shopping Bag
              </span>
              <span className="bg-rose-700 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {itemCount}
              </span>
            </Link>

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <User className="w-5 h-5 text-gray-500" />
              Customer Login / Register
            </Link>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                isActive('/') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/collection"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                isActive('/collection') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Unstitched Suits
            </Link>
            <Link
              to="/collection?fabric=Pure+Cotton"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Pure Cotton Suits
            </Link>
            <Link
              to="/collection?fabric=Chanderi+Silk"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Chanderi & Silk Suits
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                isActive('/about') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              About JVB (Since 1977)
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                isActive('/contact') ? 'bg-jvb-pink-50 text-jvb-pink-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Contact & Store Location
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-jvb-wine-700 hover:bg-pink-50"
            >
              Admin Dashboard Portal
            </Link>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-medium text-sm shadow"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order on WhatsApp (7015344280)</span>
              </a>

              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-pink-300 text-jvb-pink-700 py-2.5 rounded-lg font-medium text-sm"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow {BUSINESS_INFO.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};