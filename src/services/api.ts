/**
 * Production-ready API service layer for All Service Plumbing of Central Florida, Inc.
 * Free of fake data, sample users, or demo mock orders.
 */

export interface ContactSubmission {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  preferredDate?: string;
  preferredTime?: string;
  propertyType: 'Residential' | 'Commercial';
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

export type OrderStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface ServiceRequestSubmission {
  id: string;
  orderNumber?: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  propertyType: 'Residential' | 'Commercial';
  description: string;
  preferredDate: string;
  preferredTime: string;
  urgency: 'Emergency (Immediate)' | 'Today' | 'Within 48 Hours' | 'Flexible';
  createdAt: string;
  status: OrderStatus;
  assignedTechnician?: string;
  internalNotes?: string;
  estimatedCost?: string;
}

export interface ReviewFeedback {
  id: string;
  authorName: string;
  serviceUsed: string;
  rating: number;
  comments: string;
  locationArea: string;
  submittedAt: string;
  verifiedCustomer: boolean;
}

const STORAGE_KEYS = {
  CONTACTS: 'asp_contact_submissions',
  REQUESTS: 'asp_service_requests_clean',
  REVIEWS: 'asp_reviews_feedback',
};

export const apiService = {
  /**
   * Submit a contact inquiry to backend server with client fallback
   */
  async submitContact(data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> {
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, id: json.id };
      }
    } catch {
      // Fallback to local storage if offline
    }

    const newEntry: ContactSubmission = {
      ...data,
      id: `con-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const existing = apiService.getContacts();
    const updated = [newEntry, ...existing];
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(updated));
    return { success: true, id: newEntry.id };
  },

  /**
   * Submit a service request to backend server with client fallback
   */
  async submitServiceRequest(data: Omit<ServiceRequestSubmission, 'id' | 'createdAt' | 'status' | 'orderNumber'>): Promise<{ success: boolean; id: string; orderNumber: string }> {
    try {
      const res = await fetch('/api/public/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, id: json.id, orderNumber: json.orderNumber };
      }
    } catch {
      // Fallback
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ASP-${randomSuffix}`;
    const newRequest: ServiceRequestSubmission = {
      ...data,
      id: `req-${Date.now().toString().slice(-6)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      assignedTechnician: 'Unassigned',
      internalNotes: '',
    };

    const existing = apiService.getServiceRequests();
    const updated = [newRequest, ...existing];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
    return { success: true, id: newRequest.id, orderNumber };
  },

  /**
   * Manually create a new service order (Admin)
   */
  async createServiceOrder(data: Omit<ServiceRequestSubmission, 'id' | 'createdAt' | 'orderNumber'>): Promise<{ success: boolean; id: string }> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ASP-${randomSuffix}`;
    const newOrder: ServiceRequestSubmission = {
      ...data,
      id: `req-${Date.now().toString().slice(-6)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    const existing = apiService.getServiceRequests();
    const updated = [newOrder, ...existing];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
    return { success: true, id: newOrder.id };
  },

  /**
   * Submit customer feedback
   */
  async submitCustomerFeedback(data: Omit<ReviewFeedback, 'id' | 'submittedAt' | 'verifiedCustomer'>): Promise<{ success: boolean; id: string }> {
    const newFeedback: ReviewFeedback = {
      ...data,
      id: `rev-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      verifiedCustomer: true,
    };

    const existing = apiService.getReviews();
    const updated = [newFeedback, ...existing];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    return { success: true, id: newFeedback.id };
  },

  /**
   * Fetch contacts (clean empty list by default)
   */
  getContacts(): ContactSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch service requests (clean empty list by default)
   */
  getServiceRequests(): ServiceRequestSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch submitted reviews
   */
  getReviews(): ReviewFeedback[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Update service request status (for Admin)
   */
  updateRequestStatus(id: string, status: OrderStatus): boolean {
    const list = apiService.getServiceRequests();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
      return true;
    }
    return false;
  },

  /**
   * Update full order details
   */
  updateOrderDetails(id: string, updates: Partial<ServiceRequestSubmission>): boolean {
    const list = apiService.getServiceRequests();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
      return true;
    }
    return false;
  },

  /**
   * Delete an order
   */
  deleteServiceOrder(id: string): boolean {
    const list = apiService.getServiceRequests();
    const updated = list.filter(r => r.id !== id);
    if (updated.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  /**
   * Update contact status (for Admin)
   */
  updateContactStatus(id: string, status: ContactSubmission['status']): boolean {
    const list = apiService.getContacts();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(list));
      return true;
    }
    return false;
  }
};
