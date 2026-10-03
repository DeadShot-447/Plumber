import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { db, UserRole, OrderRecord, ServiceRecord, WebsiteContent } from './src/server/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'asp_central_florida_plumbing_secret_2026_jwt_token_key_!#$';
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers & cookies
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// ============================================================================
// SECURITY HEADERS & SANITIZATION (OWASP Best Practices)
// ============================================================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ============================================================================
// RATE LIMITING & TEMPORARY LOCKOUT (Brute-force protection)
// ============================================================================
interface FailedAttemptRecord {
  attempts: number;
  lockoutUntil?: number;
}

const failedAttemptsMap = new Map<string, FailedAttemptRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
};

const checkRateLimit = (key: string): { isLocked: boolean; remainingMinutes?: number } => {
  const record = failedAttemptsMap.get(key);
  if (!record) return { isLocked: false };

  const now = Date.now();
  if (record.lockoutUntil && record.lockoutUntil > now) {
    const remainingMinutes = Math.ceil((record.lockoutUntil - now) / 60000);
    return { isLocked: true, remainingMinutes };
  }

  // Lockout expired, reset
  if (record.lockoutUntil && record.lockoutUntil <= now) {
    failedAttemptsMap.delete(key);
    return { isLocked: false };
  }

  return { isLocked: false };
};

const recordFailedAttempt = (key: string) => {
  const now = Date.now();
  const existing = failedAttemptsMap.get(key) || { attempts: 0 };
  existing.attempts += 1;

  if (existing.attempts >= MAX_FAILED_ATTEMPTS) {
    existing.lockoutUntil = now + LOCKOUT_DURATION_MS;
  }

  failedAttemptsMap.set(key, existing);
};

const clearFailedAttempts = (key: string) => {
  failedAttemptsMap.delete(key);
};

// ============================================================================
// AUTHENTICATION & RBAC MIDDLEWARES
// ============================================================================
export interface AuthUserPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined = req.cookies?.['asp_admin_token'];

  const authHeader = req.headers.authorization;
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    
    // Verify user is not disabled
    const user = db.findUserById(decoded.userId);
    if (!user) {
      res.clearCookie('asp_admin_token');
      return res.status(401).json({ error: 'User account no longer exists.' });
    }
    if (user.status === 'disabled') {
      res.clearCookie('asp_admin_token');
      return res.status(403).json({ error: 'Your account has been disabled. Please contact Super Admin.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('asp_admin_token');
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
};

const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of: ${allowedRoles.join(', ')}.` 
      });
    }
    next();
  };
};

// ============================================================================
// AUTHENTICATION API ROUTES
// ============================================================================

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const clientIp = getClientIp(req);
  const rateLimitKey = `${clientIp}_${cleanEmail}`;

  const rateCheck = checkRateLimit(rateLimitKey);
  if (rateCheck.isLocked) {
    return res.status(429).json({ 
      error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateCheck.remainingMinutes} minutes.` 
    });
  }

  const user = db.findUserByEmail(cleanEmail);

  const dummyHash = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012';
  const hashToCompare = user ? user.passwordHash : dummyHash;
  const isMatch = bcrypt.compareSync(password, hashToCompare);

  if (!user || !isMatch) {
    recordFailedAttempt(rateLimitKey);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.status === 'disabled') {
    return res.status(403).json({ error: 'This account has been disabled. Please contact Super Admin.' });
  }

  clearFailedAttempts(rateLimitKey);
  db.updateUserLoginTime(user.id);

  const payload: AuthUserPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

  res.cookie('asp_admin_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  });

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    token,
  });
});

// GET /api/auth/me
app.get('/api/auth/me', verifyAuthToken, (req: Request, res: Response) => {
  const user = db.findUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    }
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('asp_admin_token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ============================================================================
// SUPER ADMIN USER MANAGEMENT ENDPOINTS
// ============================================================================

// GET /api/admin/users (Super Admin only)
app.get('/api/admin/users', verifyAuthToken, requireRole(['Super Admin']), (req: Request, res: Response) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  }));
  return res.json({ users });
});

// POST /api/admin/users (Super Admin only - Add new admin account)
app.post('/api/admin/users', verifyAuthToken, requireRole(['Super Admin']), (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  try {
    const newUser = db.createUser({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
      role: role as UserRole,
    });

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
      }
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to create user account.' });
  }
});

// PUT /api/admin/users/:id (Super Admin only - Edit account details/status/role)
app.put('/api/admin/users/:id', verifyAuthToken, requireRole(['Super Admin']), (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  const target = db.findUserById(id);
  if (!target) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  // Safety: Prevent disabling or demoting the last active Super Admin
  if (target.role === 'Super Admin' && (status === 'disabled' || (role && role !== 'Super Admin'))) {
    const activeSuperAdmins = db.getUsers().filter(u => u.role === 'Super Admin' && u.status === 'active' && u.id !== id);
    if (activeSuperAdmins.length === 0) {
      return res.status(400).json({ error: 'Cannot disable or demote the only remaining active Super Admin.' });
    }
  }

  const updated = db.updateUser(id, {
    ...(name ? { name: String(name).trim() } : {}),
    ...(email ? { email: String(email).trim().toLowerCase() } : {}),
    ...(role ? { role: role as UserRole } : {}),
    ...(status ? { status: status as 'active' | 'disabled' } : {}),
  });

  return res.json({
    success: true,
    user: {
      id: updated!.id,
      name: updated!.name,
      email: updated!.email,
      role: updated!.role,
      status: updated!.status,
    }
  });
});

// POST /api/admin/users/:id/reset-password (Super Admin only - Reset user password)
app.post('/api/admin/users/:id/reset-password', verifyAuthToken, requireRole(['Super Admin']), (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const success = db.setUserPassword(id, String(newPassword));
  if (!success) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({ success: true, message: 'Password has been successfully updated.' });
});

// DELETE /api/admin/users/:id (Super Admin only - Delete admin account)
app.delete('/api/admin/users/:id', verifyAuthToken, requireRole(['Super Admin']), (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.user!.userId === id) {
    return res.status(400).json({ error: 'You cannot delete your own account while logged in.' });
  }

  try {
    const success = db.deleteUser(id);
    if (!success) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ success: true, message: 'User account removed.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// POST /api/admin/settings/change-password (Authenticated User changes own password)
app.post('/api/admin/settings/change-password', verifyAuthToken, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current password and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const user = db.findUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  db.setUserPassword(user.id, newPassword);
  return res.json({ success: true, message: 'Your password has been changed successfully.' });
});

// ============================================================================
// WEBSITE CONTENT MANAGEMENT API
// ============================================================================

// GET /api/public/content (Public)
app.get('/api/public/content', (req: Request, res: Response) => {
  const content = db.getContent();
  return res.json({ content });
});

// GET /api/admin/content (Admin)
app.get('/api/admin/content', verifyAuthToken, (req: Request, res: Response) => {
  const content = db.getContent();
  return res.json({ content });
});

// PUT /api/admin/content/:section (Super Admin & Admin)
app.put('/api/admin/content/:section', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { section } = req.params;
  const updates = req.body;

  if (!['business', 'home', 'about', 'seo', 'navigation'].includes(section)) {
    return res.status(400).json({ error: 'Invalid content section.' });
  }

  const updatedContent = db.updateContent(section as keyof WebsiteContent, updates);
  return res.json({ success: true, content: updatedContent });
});

// ============================================================================
// SERVICES MANAGEMENT API
// ============================================================================

// GET /api/public/services (Public - returns enabled services)
app.get('/api/public/services', (req: Request, res: Response) => {
  const services = db.getServices(false);
  return res.json({ services });
});

// GET /api/admin/services (Admin - returns all services including disabled)
app.get('/api/admin/services', verifyAuthToken, (req: Request, res: Response) => {
  const services = db.getServices(true);
  return res.json({ services });
});

// POST /api/admin/services (Super Admin & Admin)
app.post('/api/admin/services', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { title, slug, shortDescription, fullDescription, iconName, imageUrl, commonProblems, serviceScope, benefits, faqs, enabled } = req.body;

  if (!title || !shortDescription) {
    return res.status(400).json({ error: 'Service title and short description are required.' });
  }

  const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

  const created = db.createService({
    slug: cleanSlug,
    title: String(title).trim(),
    shortDescription: String(shortDescription).trim(),
    fullDescription: fullDescription ? String(fullDescription).trim() : String(shortDescription).trim(),
    iconName: iconName || 'Wrench',
    imageUrl: imageUrl || '',
    enabled: enabled !== undefined ? Boolean(enabled) : true,
    commonProblems: Array.isArray(commonProblems) ? commonProblems : [],
    serviceScope: Array.isArray(serviceScope) ? serviceScope : [],
    benefits: Array.isArray(benefits) ? benefits : [],
    faqs: Array.isArray(faqs) ? faqs : [],
  });

  return res.status(201).json({ success: true, service: created });
});

// PUT /api/admin/services/:id (Super Admin & Admin)
app.put('/api/admin/services/:id', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = db.updateService(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Service not found.' });
  }

  return res.json({ success: true, service: updated });
});

// DELETE /api/admin/services/:id (Super Admin & Admin)
app.delete('/api/admin/services/:id', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteService(id);

  if (!success) {
    return res.status(404).json({ error: 'Service not found.' });
  }

  return res.json({ success: true, message: 'Service deleted.' });
});

// ============================================================================
// FAQS MANAGEMENT API
// ============================================================================

// GET /api/public/faqs (Public)
app.get('/api/public/faqs', (req: Request, res: Response) => {
  const faqs = db.getFaqs(false);
  return res.json({ faqs });
});

// GET /api/admin/faqs (Admin)
app.get('/api/admin/faqs', verifyAuthToken, (req: Request, res: Response) => {
  const faqs = db.getFaqs(true);
  return res.json({ faqs });
});

// POST /api/admin/faqs (Super Admin & Admin)
app.post('/api/admin/faqs', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { question, answer, category } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }

  const created = db.createFaq({ question, answer, category });
  return res.status(201).json({ success: true, faq: created });
});

// PUT /api/admin/faqs/:id (Super Admin & Admin)
app.put('/api/admin/faqs/:id', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = db.updateFaq(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'FAQ not found.' });
  }

  return res.json({ success: true, faq: updated });
});

// DELETE /api/admin/faqs/:id (Super Admin & Admin)
app.delete('/api/admin/faqs/:id', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteFaq(id);

  if (!success) {
    return res.status(404).json({ error: 'FAQ not found.' });
  }

  return res.json({ success: true, message: 'FAQ deleted.' });
});

// ============================================================================
// ORDERS MANAGEMENT API
// ============================================================================

// GET /api/admin/orders - protected (Staff, Admin, Super Admin)
app.get('/api/admin/orders', verifyAuthToken, (req: Request, res: Response) => {
  const orders = db.getOrders();
  return res.json({ orders });
});

// POST /api/admin/orders - protected (Staff, Admin, Super Admin)
app.post('/api/admin/orders', verifyAuthToken, (req: Request, res: Response) => {
  const { name, phone, serviceType, address, propertyType, description, preferredDate, preferredTime, urgency, assignedTechnician, internalNotes, estimatedCost, status } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Customer name, phone, and address are required.' });
  }

  const newOrder = db.createOrder({
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: req.body.email ? String(req.body.email).trim() : '',
    serviceType: serviceType || 'Emergency Plumbing',
    address: String(address).trim(),
    propertyType: propertyType || 'Residential',
    description: description ? String(description).trim() : '',
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    preferredTime: preferredTime || 'Morning (8AM - 12PM)',
    urgency: urgency || 'Emergency (Immediate)',
    status: status || 'Pending',
    assignedTechnician: assignedTechnician || 'Unassigned',
    internalNotes: internalNotes || `Created by ${req.user!.name}`,
    estimatedCost: estimatedCost || '',
  });

  return res.status(201).json({ success: true, order: newOrder });
});

// PUT /api/admin/orders/:id - protected (Staff, Admin, Super Admin)
app.put('/api/admin/orders/:id', verifyAuthToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = db.updateOrder(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  return res.json({ success: true, order: updated });
});

// DELETE /api/admin/orders/:id - strictly protected (Admin and Super Admin only; Staff forbidden)
app.delete('/api/admin/orders/:id', verifyAuthToken, requireRole(['Super Admin', 'Admin']), (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteOrder(id);

  if (!success) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  return res.json({ success: true, message: 'Order successfully deleted.' });
});

// ============================================================================
// PUBLIC API ENDPOINTS (Lead capture from website visitors)
// ============================================================================
app.post('/api/public/service-request', (req: Request, res: Response) => {
  const { name, phone, email, serviceType, address, propertyType, description, preferredDate, preferredTime, urgency } = req.body;

  if (!name || !phone || !address || !description) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const order = db.createOrder({
    name: String(name).trim().slice(0, 100),
    phone: String(phone).trim().slice(0, 30),
    email: email ? String(email).trim().slice(0, 100) : '',
    serviceType: serviceType || 'Emergency Plumbing',
    address: String(address).trim().slice(0, 200),
    propertyType: propertyType === 'Commercial' ? 'Commercial' : 'Residential',
    description: String(description).trim().slice(0, 1000),
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    preferredTime: preferredTime || 'Morning (8AM - 12PM)',
    urgency: urgency || 'Within 48 Hours',
    status: 'Pending',
    assignedTechnician: 'Unassigned',
    internalNotes: 'Web submission via online form.',
  });

  return res.status(201).json({ success: true, id: order.id, orderNumber: order.orderNumber });
});

app.post('/api/public/contact', (req: Request, res: Response) => {
  const { fullName, phone, email, serviceNeeded, propertyType, message } = req.body;

  if (!fullName || !phone || !message) {
    return res.status(400).json({ error: 'Please provide full name, phone number, and message.' });
  }

  const order = db.createOrder({
    name: String(fullName).trim().slice(0, 100),
    phone: String(phone).trim().slice(0, 30),
    email: email ? String(email).trim().slice(0, 100) : '',
    serviceType: serviceNeeded || 'General Plumbing Inquiry',
    address: 'Contact Form Inquiry (Sebring Area)',
    propertyType: propertyType === 'Commercial' ? 'Commercial' : 'Residential',
    description: String(message).trim().slice(0, 1000),
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: 'Anytime',
    urgency: 'Flexible',
    status: 'Pending',
    assignedTechnician: 'Unassigned',
    internalNotes: 'Customer contacted via website contact form.',
  });

  return res.status(201).json({ success: true, id: order.id, orderNumber: order.orderNumber });
});

// ============================================================================
// VITE SPA & STATIC SERVING INTEGRATION
// ============================================================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running securely on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode.`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
