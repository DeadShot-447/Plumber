import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Clock, MapPin, Shield } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { content } = useWebsiteContent();

  const business = content?.business || BUSINESS_INFO;
  const navLinks = content?.navigation
    ? content.navigation.filter(n => n.enabled)
    : [
        { id: 'nav-1', name: 'Home', href: '/', enabled: true, order: 1 },
        { id: 'nav-2', name: 'About', href: '/about', enabled: true, order: 2 },
        { id: 'nav-3', name: 'Services', href: '/services', enabled: true, order: 3 },
        { id: 'nav-4', name: 'Service Areas', href: '/service-areas', enabled: true, order: 4 },
        { id: 'nav-5', name: 'Reviews', href: '/reviews', enabled: true, order: 5 },
        { id: 'nav-6', name: 'Contact', href: '/contact', enabled: true, order: 6 },
      ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Notification Bar - 24/7 Availability & Quick Contact */}
      <div className="bg-slate-900 text-slate-200 text-xs sm:text-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-6 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {business.hours || 'Open 24 Hours'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {business.city}, {business.state} & Central Florida
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              Residential & Commercial
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`tel:${business.phoneRaw}`}
              className="flex items-center gap-1.5 text-sky-300 hover:text-white font-semibold transition-colors group"
              title="Call All Service Plumbing 24/7"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>{business.phoneFormatted}</span>
            </a>

            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1 text-slate-400 hover:text-white font-medium text-xs border-l border-slate-700 pl-3 transition-colors"
              title="Dispatcher & Service Orders Admin"
            >
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header - Sticky */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Zone 1: Logo & Brand Lockup */}
            <Link
              to="/"
              className="flex flex-col group py-1"
              aria-label={`${business.name} Homepage`}
            >
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                {business.shortName || 'All Service Plumbing'}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-sky-600 tracking-wide">
                {business.subtitle || 'of Central Florida, Inc.'}
              </span>
            </Link>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.id || link.name}
                  to={link.href}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive(link.href)
                      ? 'text-sky-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-600'
                      : 'text-slate-700 hover:text-sky-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Zone 3: Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`tel:${business.phoneRaw}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="hidden xl:inline">Call Now:</span>
                <span>{business.phoneFormatted}</span>
              </a>

              <Link
                to="/request-service"
                className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                Request Service
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:${business.phoneRaw}`}
                className="sm:hidden p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                aria-label="Direct Phone Call"
              >
                <Phone className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-colors"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id || link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-sky-600" />
                <span>Dispatcher / Admin Portal</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <a
                href={`tel:${business.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call {business.phoneFormatted}</span>
              </a>

              <Link
                to="/request-service"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-sm"
              >
                Request Service
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
