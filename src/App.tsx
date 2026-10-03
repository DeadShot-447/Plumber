/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomCTA from './components/MobileBottomCTA';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import AdminAuthGuard from './components/AdminAuthGuard';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesIndexPage from './pages/ServicesIndexPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ServiceAreasPage from './pages/ServiceAreasPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import RequestServicePage from './pages/RequestServicePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ContentProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen text-slate-900 pb-16 md:pb-0">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesIndexPage />} />
                  <Route path="/services/:slug" element={<ServiceDetailPage />} />
                  <Route path="/service-areas" element={<ServiceAreasPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/request-service" element={<RequestServicePage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route 
                    path="/admin" 
                    element={
                      <AdminAuthGuard>
                        <AdminPage />
                      </AdminAuthGuard>
                    } 
                  />
                  <Route 
                    path="/admin/*" 
                    element={
                      <AdminAuthGuard>
                        <AdminPage />
                      </AdminAuthGuard>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <MobileBottomCTA />
            </div>
          </ContentProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
