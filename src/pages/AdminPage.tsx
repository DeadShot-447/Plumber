import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CalendarClock, 
  Download, 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Wrench, 
  X, 
  Filter, 
  RefreshCw,
  Building2,
  Home,
  LogOut,
  Users,
  Settings,
  Globe,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  ExternalLink,
  Lock,
  Edit,
  Save,
  HelpCircle,
  Menu,
  ToggleLeft,
  ToggleRight,
  KeyRound,
  ShieldAlert,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWebsiteContent } from '../context/ContentContext';
import { OrderStatus, ServiceRequestSubmission } from '../services/api';

const TECHNICIANS = [
  'Unassigned',
  'Dave Rogers (Lead Plumber)',
  'Carlos Mendez (Tech #4)',
  'Marcus Vance (Master Plumber)',
  'Sarah Lin (Commercial Specialist)',
];

export default function AdminPage() {
  const { user, logout, token } = useAuth();
  const { content, services: liveServices, faqs: liveFaqs, refreshContent } = useWebsiteContent();
  const navigate = useNavigate();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'content' | 'faqs' | 'users' | 'settings'>('orders');

  // Orders state
  const [orders, setOrders] = useState<ServiceRequestSubmission[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ServiceRequestSubmission | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<ServiceRequestSubmission | null>(null);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);

  // Admin Users state (Super Admin)
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [userPasswordReset, setUserPasswordReset] = useState<any | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin' as 'Super Admin' | 'Admin' | 'Staff',
  });

  // Self change password state (Settings)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Services Management State
  const [serviceToEdit, setServiceToEdit] = useState<any | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<any | null>(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Wrench',
    imageUrl: '',
    enabled: true,
  });

  // FAQs State
  const [faqToEdit, setFaqToEdit] = useState<any | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<any | null>(null);
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General',
  });

  // Manual Order Creation State
  const [newOrderForm, setNewOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'Emergency Plumbing',
    address: '',
    propertyType: 'Residential' as 'Residential' | 'Commercial',
    description: '',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: 'Morning (8AM - 12PM)',
    urgency: 'Emergency (Immediate)' as any,
    assignedTechnician: 'Unassigned',
    estimatedCost: '',
  });

  // Super Admin Change Other Admin Passwords State (Settings tab)
  const [targetAdminUserId, setTargetAdminUserId] = useState<string>('');
  const [targetAdminNewPassword, setTargetAdminNewPassword] = useState<string>('');

  // Website Content Edit State
  const [editableContent, setEditableContent] = useState(content);
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync content state when context updates
  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  // Load orders
  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // ignore
    }
  };

  // Load admin users (Super Admin only)
  const loadAdminUsers = async () => {
    if (user?.role !== 'Super Admin') return;
    try {
      const res = await fetch('/api/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data.users || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadOrders();
    if (user?.role === 'Super Admin') {
      loadAdminUsers();
    }
  }, [token, user]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // =========================================================================
  // DASHBOARD METRICS CALCULATION
  // =========================================================================
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const completed = orders.filter(o => o.status === 'Completed').length;
    const todays = orders.filter(o => {
      const createdDate = o.createdAt ? o.createdAt.split('T')[0] : '';
      return createdDate === todayStr || o.preferredDate === todayStr;
    }).length;

    return { total, pending, completed, todays };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (selectedStatus !== 'All' && order.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = order.name?.toLowerCase().includes(query);
        const matchesPhone = order.phone?.includes(query);
        const matchesId = order.id?.toLowerCase().includes(query);
        const matchesOrderNumber = order.orderNumber?.toLowerCase().includes(query);
        const matchesAddress = order.address?.toLowerCase().includes(query);
        return matchesName || matchesPhone || matchesId || matchesOrderNumber || matchesAddress;
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  // =========================================================================
  // ORDER ACTIONS
  // =========================================================================
  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
        showToast(`Order status updated to "${newStatus}"`);
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveOrderDetails = async (updates: Partial<ServiceRequestSubmission>) => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        loadOrders();
        setSelectedOrder(prev => prev ? { ...prev, ...updates } : null);
        showToast('Order details saved');
      }
    } catch {
      showToast('Failed to save order details', 'error');
    }
  };

  const handleConfirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    if (user?.role === 'Staff') {
      showToast('Staff role cannot delete orders.', 'error');
      setOrderToDelete(null);
      return;
    }
    try {
      const res = await fetch(`/api/admin/orders/${orderToDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (res.ok) {
        loadOrders();
        if (selectedOrder?.id === orderToDelete.id) setSelectedOrder(null);
        showToast(`Order ${orderToDelete.orderNumber || orderToDelete.id} deleted.`);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to delete order', 'error');
      }
    } catch {
      showToast('Network error while deleting order', 'error');
    }
    setOrderToDelete(null);
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders to export.');
      return;
    }
    const headers = ['Order Number', 'ID', 'Status', 'Customer Name', 'Phone', 'Email', 'Service Type', 'Property', 'Address', 'Urgency', 'Date', 'Time', 'Technician', 'Created At'];
    const rows = filteredOrders.map(o => [
      `"${o.orderNumber || o.id}"`,
      `"${o.id}"`,
      `"${o.status}"`,
      `"${o.name}"`,
      `"${o.phone}"`,
      `"${o.email || ''}"`,
      `"${o.serviceType}"`,
      `"${o.propertyType}"`,
      `"${o.address}"`,
      `"${o.urgency}"`,
      `"${o.preferredDate}"`,
      `"${o.preferredTime}"`,
      `"${o.assignedTechnician || 'Unassigned'}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `service_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredOrders.length} orders`);
  };

  // =========================================================================
  // SUPER ADMIN USER MANAGEMENT ACTIONS
  // =========================================================================
  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      showToast('Please fill all required user fields', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (res.ok) {
        loadAdminUsers();
        setShowAddUserModal(false);
        setNewUserForm({ name: '', email: '', password: '', role: 'Admin' });
        showToast(`User ${data.user.name} created successfully.`);
      } else {
        showToast(data.error || 'Failed to create user', 'error');
      }
    } catch {
      showToast('Error creating user account', 'error');
    }
  };

  const handleUpdateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    try {
      const res = await fetch(`/api/admin/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          name: userToEdit.name,
          email: userToEdit.email,
          role: userToEdit.role,
          status: userToEdit.status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        loadAdminUsers();
        setUserToEdit(null);
        showToast(`User account updated.`);
      } else {
        showToast(data.error || 'Failed to update user', 'error');
      }
    } catch {
      showToast('Error updating user', 'error');
    }
  };

  const handleResetUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPasswordReset || !newAdminPassword) return;
    try {
      const res = await fetch(`/api/admin/users/${userPasswordReset.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword: newAdminPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserPasswordReset(null);
        setNewAdminPassword('');
        showToast('Password reset successfully.');
      } else {
        showToast(data.error || 'Failed to reset password', 'error');
      }
    } catch {
      showToast('Error resetting password', 'error');
    }
  };

  const handleDeleteAdminUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        loadAdminUsers();
        showToast('Admin user deleted successfully.');
      } else {
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch {
      showToast('Error deleting user account', 'error');
    }
    setUserToDelete(null);
  };

  // Self change password (Settings)
  const handleChangeSelfPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/settings/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Your password was updated successfully.');
      } else {
        showToast(data.error || 'Failed to change password.', 'error');
      }
    } catch {
      showToast('Error updating password', 'error');
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.name || !newOrderForm.phone || !newOrderForm.address) {
      showToast('Customer name, phone, and address are required.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(newOrderForm),
      });
      if (res.ok) {
        await loadOrders();
        setShowCreateOrderModal(false);
        setNewOrderForm({
          name: '',
          phone: '',
          email: '',
          serviceType: 'Emergency Plumbing',
          address: '',
          propertyType: 'Residential',
          description: '',
          preferredDate: new Date().toISOString().split('T')[0],
          preferredTime: 'Morning (8AM - 12PM)',
          urgency: 'Emergency (Immediate)',
          assignedTechnician: 'Unassigned',
          estimatedCost: '',
        });
        showToast('New service order created.');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to create order', 'error');
      }
    } catch {
      showToast('Error creating order', 'error');
    }
  };

  const handleChangeOtherAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAdminUserId) {
      showToast('Please select an admin account.', 'error');
      return;
    }
    if (!targetAdminNewPassword || targetAdminNewPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${targetAdminUserId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword: targetAdminNewPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setTargetAdminUserId('');
        setTargetAdminNewPassword('');
        showToast('Admin password successfully updated.');
      } else {
        showToast(data.error || 'Failed to update password', 'error');
      }
    } catch {
      showToast('Error updating admin password', 'error');
    }
  };

  // =========================================================================
  // WEBSITE CONTENT & SETTINGS ACTIONS
  // =========================================================================
  const handleSaveContentSection = async (section: 'business' | 'home' | 'about' | 'seo' | 'navigation') => {
    setIsSavingContent(true);
    try {
      const res = await fetch(`/api/admin/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(editableContent[section]),
      });
      if (res.ok) {
        await refreshContent();
        showToast(`Website ${section} settings saved to database.`);
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch {
      showToast('Error saving settings', 'error');
    } finally {
      setIsSavingContent(false);
    }
  };

  // =========================================================================
  // SERVICES MANAGEMENT ACTIONS
  // =========================================================================
  const handleToggleService = async (service: any) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ enabled: !service.enabled }),
      });
      if (res.ok) {
        await refreshContent();
        showToast(`Service "${service.title}" ${!service.enabled ? 'enabled' : 'disabled'}.`);
      }
    } catch {
      showToast('Failed to toggle service', 'error');
    }
  };

  const handleSaveServiceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceToEdit) return;
    try {
      const res = await fetch(`/api/admin/services/${serviceToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(serviceToEdit),
      });
      if (res.ok) {
        await refreshContent();
        setServiceToEdit(null);
        showToast('Service updated successfully.');
      }
    } catch {
      showToast('Error updating service', 'error');
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.title || !newServiceForm.shortDescription) {
      showToast('Title and short description are required.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newServiceForm,
          commonProblems: ["System malfunction or leak", "Slow drainage or pressure loss"],
          serviceScope: ["Initial diagnostic assessment", "Precision repair and replacement"],
          benefits: ["Professional solution", "24-hour service availability"],
          faqs: [{ question: `How can I request ${newServiceForm.title}?`, answer: "Call us directly 24 hours a day or request service online." }]
        }),
      });
      if (res.ok) {
        await refreshContent();
        setShowAddServiceModal(false);
        setNewServiceForm({ title: '', slug: '', shortDescription: '', fullDescription: '', iconName: 'Wrench', imageUrl: '', enabled: true });
        showToast('New service added to directory.');
      }
    } catch {
      showToast('Error creating service', 'error');
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      const res = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (res.ok) {
        await refreshContent();
        showToast('Service removed.');
      }
    } catch {
      showToast('Error deleting service', 'error');
    }
    setServiceToDelete(null);
  };

  // =========================================================================
  // FAQS MANAGEMENT ACTIONS
  // =========================================================================
  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqForm.question || !newFaqForm.answer) return;
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(newFaqForm),
      });
      if (res.ok) {
        await refreshContent();
        setShowAddFaqModal(false);
        setNewFaqForm({ question: '', answer: '', category: 'General' });
        showToast('FAQ created successfully.');
      }
    } catch {
      showToast('Error creating FAQ', 'error');
    }
  };

  const handleSaveFaqEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqToEdit) return;
    try {
      const res = await fetch(`/api/admin/faqs/${faqToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(faqToEdit),
      });
      if (res.ok) {
        await refreshContent();
        setFaqToEdit(null);
        showToast('FAQ updated.');
      }
    } catch {
      showToast('Error saving FAQ', 'error');
    }
  };

  const handleDeleteFaq = async () => {
    if (!faqToDelete) return;
    try {
      const res = await fetch(`/api/admin/faqs/${faqToDelete.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (res.ok) {
        await refreshContent();
        showToast('FAQ deleted.');
      }
    } catch {
      showToast('Error deleting FAQ', 'error');
    }
    setFaqToDelete(null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Assigned': return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'In Progress': return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Completed': return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Cancelled': return 'bg-slate-100 text-slate-600 border-slate-300';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Admin': return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'Staff': return 'bg-purple-50 text-purple-800 border-purple-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 sm:py-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification */}
        {notification && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-semibold animate-in slide-in-from-top-2 border ${
            notification.type === 'error'
              ? 'bg-red-900 text-white border-red-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Top Session & RBAC Profile Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  {user?.name || 'Administrator'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(user?.role)}`}>
                  {user?.role}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {user?.email} · Authenticated via JWT Session
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              title="Securely log out and clear auth cookie"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Global Tab Navigation Controls */}
        <div className="flex items-center gap-1 overflow-x-auto bg-white p-1.5 rounded-xl border border-slate-200 mb-6 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Service Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'services' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Website Services ({liveServices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'content' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website Content & SEO</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'faqs' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs ({liveFaqs.length})</span>
          </button>

          {user?.role === 'Super Admin' && (
            <button
              type="button"
              onClick={() => {
                loadAdminUsers();
                setActiveTab('users');
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'users' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Admin Accounts</span>
            </button>
          )}

          {user?.role === 'Super Admin' && (
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Navigation</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SERVICE ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Dashboard Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div 
                onClick={() => setSelectedStatus('All')}
                className={`cursor-pointer bg-white rounded-xl border p-5 shadow-2xs transition-all ${
                  selectedStatus === 'All' ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-black text-slate-900 font-mono tracking-tight">{metrics.total}</div>
                <div className="mt-1 text-[11px] text-slate-500">All registered service orders</div>
              </div>

              <div 
                onClick={() => setSelectedStatus('Pending')}
                className={`cursor-pointer bg-white rounded-xl border p-5 shadow-2xs transition-all ${
                  selectedStatus === 'Pending' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-black text-amber-600 font-mono tracking-tight">{metrics.pending}</div>
                <div className="mt-1 text-[11px] text-slate-500">Requires dispatcher review</div>
              </div>

              <div 
                onClick={() => setSelectedStatus('Completed')}
                className={`cursor-pointer bg-white rounded-xl border p-5 shadow-2xs transition-all ${
                  selectedStatus === 'Completed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-black text-emerald-600 font-mono tracking-tight">{metrics.completed}</div>
                <div className="mt-1 text-[11px] text-slate-500">Service fulfilled</div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Today's Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-black text-sky-600 font-mono tracking-tight">{metrics.todays}</div>
                <div className="mt-1 text-[11px] text-slate-500">Scheduled for today</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, or order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-600" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreateOrderModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Order</span>
                  </button>
                </div>
              </div>

              {/* Status Segmented Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-0.5 border-t border-slate-100 text-xs font-semibold">
                <span className="text-slate-400 mr-2 text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Status:
                </span>
                {['All', 'Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedStatus === status ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{status}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-200 text-slate-700">
                      {status === 'All' ? orders.length : orders.filter(o => o.status === status).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Urgency</th>
                      <th className="py-3.5 px-4">Scheduled</th>
                      <th className="py-3.5 px-4">Technician</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-700 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="hover:underline text-left block"
                            >
                              {order.orderNumber || order.id}
                            </button>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{order.name}</div>
                            <a href={`tel:${order.phone}`} className="text-xs text-slate-500 hover:text-sky-700 font-mono">
                              {order.phone}
                            </a>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800 block">{order.serviceType}</span>
                            <span className="text-[11px] text-slate-400">{order.propertyType}</span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                              order.urgency === 'Emergency (Immediate)' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {order.urgency}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                            <span className="font-medium text-slate-800 block">{order.preferredDate}</span>
                            <span className="text-[11px] text-slate-400">{order.preferredTime}</span>
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            <span className={order.assignedTechnician !== 'Unassigned' ? 'font-medium text-slate-800' : 'text-slate-400 italic'}>
                              {order.assignedTechnician || 'Unassigned'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${getStatusBadge(order.status)}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Assigned">Assigned</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="p-1.5 rounded text-slate-600 hover:text-sky-700 hover:bg-slate-100"
                                title="View full order details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (user?.role === 'Staff') {
                                    showToast('Staff role cannot delete orders.', 'error');
                                    return;
                                  }
                                  setOrderToDelete(order);
                                }}
                                disabled={user?.role === 'Staff'}
                                className={`p-1.5 rounded ${user?.role === 'Staff' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                title={user?.role === 'Staff' ? 'Requires Admin role' : 'Delete order'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <p className="font-bold text-slate-800 text-sm">No service orders found.</p>
                          <p className="text-xs text-slate-400 mt-1">Incoming website requests or manual orders will appear here.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: WEBSITE SERVICES DIRECTORY (Add, Edit, Delete, Enable/Disable) */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Website Services Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control which plumbing services appear on the public website, edit descriptions, and manage photos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddServiceModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        /{service.slug}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleService(service)}
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          service.enabled ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {service.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {service.imageUrl && (
                      <div className="aspect-16/9 rounded-lg overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setServiceToEdit(service)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Service</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceToDelete(service)}
                      className="text-xs text-red-500 hover:text-red-700 p-1"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WEBSITE CONTENT & SEO SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            
            {/* Business Contact & Phone Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Company Contact & Business Information</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Updates phone numbers, physical address, and hours across the website.</p>
                </div>
                <button
                  type="button"
                  disabled={isSavingContent}
                  onClick={() => handleSaveContentSection('business')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Business Info</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={editableContent.business.name}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, name: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Display Phone Number</label>
                  <input
                    type="text"
                    value={editableContent.business.phoneFormatted}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, phoneFormatted: e.target.value, phone: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Raw Telephone Link (tel:)</label>
                  <input
                    type="text"
                    value={editableContent.business.phoneRaw}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, phoneRaw: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Physical Street Address</label>
                  <input
                    type="text"
                    value={editableContent.business.address}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, address: e.target.value, fullAddress: `${e.target.value}, ${editableContent.business.city}, ${editableContent.business.state} ${editableContent.business.zip}` } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={editableContent.business.hours}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, hours: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Homepage Content Editor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Homepage Content Editor</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Customize hero messaging, supporting text, and emergency banners.</p>
                </div>
                <button
                  type="button"
                  disabled={isSavingContent}
                  onClick={() => handleSaveContentSection('home')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Homepage</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={editableContent.home.heroHeadline}
                    onChange={(e) => setEditableContent({ ...editableContent, home: { ...editableContent.home, heroHeadline: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hero Supporting Text</label>
                  <textarea
                    rows={2}
                    value={editableContent.home.heroSupportingText}
                    onChange={(e) => setEditableContent({ ...editableContent, home: { ...editableContent.home, heroSupportingText: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Emergency Section Headline</label>
                    <input
                      type="text"
                      value={editableContent.home.emergencyHeadline}
                      onChange={(e) => setEditableContent({ ...editableContent, home: { ...editableContent.home, emergencyHeadline: e.target.value } })}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Emergency Callout Text</label>
                    <input
                      type="text"
                      value={editableContent.home.emergencyText}
                      onChange={(e) => setEditableContent({ ...editableContent, home: { ...editableContent.home, emergencyText: e.target.value } })}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About Page Content Editor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">About Page Content</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Customize local presence, service approach, and overview text.</p>
                </div>
                <button
                  type="button"
                  disabled={isSavingContent}
                  onClick={() => handleSaveContentSection('about')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Page</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">About Headline</label>
                  <input
                    type="text"
                    value={editableContent.about.aboutHeroHeadline}
                    onChange={(e) => setEditableContent({ ...editableContent, about: { ...editableContent.about, aboutHeroHeadline: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Local Service Paragraph</label>
                  <textarea
                    rows={3}
                    value={editableContent.about.localServiceText}
                    onChange={(e) => setEditableContent({ ...editableContent, about: { ...editableContent.about, localServiceText: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Search Engine Optimization (SEO) & Social Cards</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Configure meta tags, search snippet titles, and keywords.</p>
                </div>
                <button
                  type="button"
                  disabled={isSavingContent}
                  onClick={() => handleSaveContentSection('seo')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400"
                >
                  <Save className="w-4 h-4" />
                  <span>Save SEO Settings</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Page Meta Title</label>
                  <input
                    type="text"
                    value={editableContent.seo.metaTitle}
                    onChange={(e) => setEditableContent({ ...editableContent, seo: { ...editableContent.seo, metaTitle: e.target.value, ogTitle: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meta Description (120-160 chars)</label>
                  <textarea
                    rows={2}
                    value={editableContent.seo.metaDescription}
                    onChange={(e) => setEditableContent({ ...editableContent, seo: { ...editableContent.seo, metaDescription: e.target.value, ogDescription: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meta Keywords</label>
                  <input
                    type="text"
                    value={editableContent.seo.keywords}
                    onChange={(e) => setEditableContent({ ...editableContent, seo: { ...editableContent.seo, keywords: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-slate-600"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FAQS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions (FAQ)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage questions and answers displayed across the website.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddFaqModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {liveFaqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {faq.category || 'General'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{faq.question}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{faq.answer}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => setFaqToEdit(faq)}
                      className="p-1.5 rounded text-slate-600 hover:text-sky-700 hover:bg-slate-100"
                      title="Edit question and answer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFaqToDelete(faq)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SUPER ADMIN USER MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'users' && user?.role === 'Super Admin' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Admin Accounts & Access Control (RBAC)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Super Admin control to add, edit, disable, reset passwords, or delete administrative accounts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Admin Account</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Name & Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <span className="text-xs text-slate-500 font-mono">{u.email}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          u.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {u.status === 'active' ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setUserPasswordReset(u)}
                            className="p-1.5 rounded text-slate-600 hover:text-sky-700 hover:bg-slate-100"
                            title="Reset password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setUserToEdit(u)}
                            className="p-1.5 rounded text-slate-600 hover:text-sky-700 hover:bg-slate-100"
                            title="Edit user details and role"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            disabled={u.id === user.id}
                            className={`p-1.5 rounded ${u.id === user.id ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                            title={u.id === user.id ? 'Cannot delete current account' : 'Delete user'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SETTINGS & NAVIGATION (Super Admin Only) */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && user?.role === 'Super Admin' && (
          <div className="space-y-8">
            
            {/* Self Password Change */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs max-w-xl">
              <h3 className="text-base font-bold text-slate-900 mb-1">Change Your Super Admin Password</h3>
              <p className="text-xs text-slate-500 mb-6">Update your secure login password (stored with bcrypt 10-round hash).</p>

              <form onSubmit={handleChangeSelfPassword} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Password (Min 8 characters)</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs"
                  >
                    Update My Password
                  </button>
                </div>
              </form>
            </div>

            {/* Super Admin Change Other Admin Passwords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs max-w-xl">
              <h3 className="text-base font-bold text-slate-900 mb-1">Change Other Admin Passwords</h3>
              <p className="text-xs text-slate-500 mb-6">Select an admin account to update or reset their secure credentials.</p>

              <form onSubmit={handleChangeOtherAdminPassword} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Administrator Account</label>
                  <select
                    value={targetAdminUserId}
                    onChange={(e) => setTargetAdminUserId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="">-- Choose Admin Account --</option>
                    {adminUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email}) - {u.role} [{u.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Password for Selected Admin (Min 8 chars)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={targetAdminNewPassword}
                    onChange={(e) => setTargetAdminNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!targetAdminUserId}
                    className="px-5 py-2.5 rounded-lg font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 shadow-xs transition-colors"
                  >
                    Update Admin Password
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Update Business Information (Settings) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Update Business Information</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage company name, contact numbers, address, and 24-hour hours.</p>
                </div>
                <button
                  type="button"
                  disabled={isSavingContent}
                  onClick={() => handleSaveContentSection('business')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Business Info</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={editableContent.business.name}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, name: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telephone Number</label>
                  <input
                    type="text"
                    value={editableContent.business.phoneFormatted}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, phoneFormatted: e.target.value, phone: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Raw Phone (tel:)</label>
                  <input
                    type="text"
                    value={editableContent.business.phoneRaw}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, phoneRaw: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={editableContent.business.address}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, address: e.target.value, fullAddress: `${e.target.value}, ${editableContent.business.city}, ${editableContent.business.state} ${editableContent.business.zip}` } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={editableContent.business.hours}
                    onChange={(e) => setEditableContent({ ...editableContent, business: { ...editableContent.business, hours: e.target.value } })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Quick Website Content Jump / Overview (Settings) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Manage Website Content</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Edit live headlines, about copy, SEO keywords, and services.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Open Full Content Editor &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Homepage Content</span>
                  <p className="text-slate-500 mt-1 line-clamp-2">{editableContent.home.heroHeadline}</p>
                  <button type="button" onClick={() => setActiveTab('content')} className="text-sky-700 font-bold mt-2 inline-block">
                    Edit Hero & Emergency &rarr;
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">About Page Content</span>
                  <p className="text-slate-500 mt-1 line-clamp-2">{editableContent.about.aboutHeroHeadline}</p>
                  <button type="button" onClick={() => setActiveTab('content')} className="text-sky-700 font-bold mt-2 inline-block">
                    Edit About Copy &rarr;
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">SEO & Social Meta</span>
                  <p className="text-slate-500 mt-1 line-clamp-2">{editableContent.seo.metaTitle}</p>
                  <button type="button" onClick={() => setActiveTab('content')} className="text-sky-700 font-bold mt-2 inline-block">
                    Edit Meta Tags &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Menu Management */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Website Navigation & Menu Items</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Enable, disable, or rename primary header navigation links.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveContentSection('navigation')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Navigation</span>
                </button>
              </div>

              <div className="space-y-3">
                {editableContent.navigation.map((nav, index) => (
                  <div key={nav.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 font-bold">{index + 1}</span>
                      <input
                        type="text"
                        value={nav.name}
                        onChange={(e) => {
                          const updated = [...editableContent.navigation];
                          updated[index].name = e.target.value;
                          setEditableContent({ ...editableContent, navigation: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-800"
                      />
                      <span className="text-slate-400 font-mono text-[11px]">{nav.href}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...editableContent.navigation];
                        updated[index].enabled = !updated[index].enabled;
                        setEditableContent({ ...editableContent, navigation: updated });
                      }}
                      className={`px-3 py-1 rounded font-bold text-[11px] ${
                        nav.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {nav.enabled ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: VIEW FULL ORDER DETAILS */}
        {/* ========================================================================= */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-mono">{selectedOrder.orderNumber || selectedOrder.id}</h2>
                    <span className="text-xs text-slate-500">Logged on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs text-slate-700">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Workflow Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className={`font-bold px-3 py-1.5 rounded-lg border ${getStatusBadge(selectedOrder.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Customer:</span>
                    <span className="font-bold text-slate-900">{selectedOrder.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone:</span>
                    <a href={`tel:${selectedOrder.phone}`} className="font-bold text-sky-700 underline font-mono">{selectedOrder.phone}</a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Address:</span>
                    <span className="font-bold text-slate-900">{selectedOrder.address}</span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block mb-1">Issue Description:</span>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white leading-relaxed">{selectedOrder.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Assign Technician</label>
                    <select
                      value={selectedOrder.assignedTechnician || 'Unassigned'}
                      onChange={(e) => handleSaveOrderDetails({ assignedTechnician: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {TECHNICIANS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estimated Cost</label>
                    <input
                      type="text"
                      placeholder="$250 - $350"
                      value={selectedOrder.estimatedCost || ''}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, estimatedCost: e.target.value })}
                      onBlur={(e) => handleSaveOrderDetails({ estimatedCost: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Internal Notes & Work Log</label>
                  <textarea
                    rows={3}
                    value={selectedOrder.internalNotes || ''}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, internalNotes: e.target.value })}
                    onBlur={(e) => handleSaveOrderDetails({ internalNotes: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
                {user?.role !== 'Staff' && (
                  <button
                    type="button"
                    onClick={() => setOrderToDelete(selectedOrder)}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Delete Order
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: DELETE CONFIRMATION */}
        {/* ========================================================================= */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Delete Service Order?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to permanently delete order <strong>{orderToDelete.orderNumber || orderToDelete.id}</strong>?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOrderToDelete(null)} className="px-4 py-2 rounded text-xs font-semibold text-slate-600">Cancel</button>
                <button type="button" onClick={handleConfirmDeleteOrder} className="px-4 py-2 rounded text-xs font-bold text-white bg-red-600 hover:bg-red-500">Confirm Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD ADMIN USER */}
        {/* ========================================================================= */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Create Admin Account</h3>
                <button type="button" onClick={() => setShowAddUserModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleCreateAdminUser} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@allserviceplumbing.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password (Min 8 chars)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Permissions</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="Super Admin">Super Admin (Full User & Site Management)</option>
                    <option value="Admin">Admin (Orders, Content & Service Management)</option>
                    <option value="Staff">Staff (Orders Viewing & Dispatch Status Only)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowAddUserModal(false)} className="px-4 py-2 rounded text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded font-bold text-white bg-emerald-600 hover:bg-emerald-500">Create Account</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: RESET ADMIN PASSWORD */}
        {/* ========================================================================= */}
        {userPasswordReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Reset Password for {userPasswordReset.name}</h3>
              <form onSubmit={handleResetUserPassword} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Password (Min 8 characters)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setUserPasswordReset(null)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded">Set Password</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: EDIT SERVICE */}
        {/* ========================================================================= */}
        {serviceToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="text-base font-bold text-slate-900">Edit Service: {serviceToEdit.title}</h3>
                <button type="button" onClick={() => setServiceToEdit(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSaveServiceEdit} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={serviceToEdit.title}
                    onChange={(e) => setServiceToEdit({ ...serviceToEdit, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Description (for cards)</label>
                  <textarea
                    rows={2}
                    required
                    value={serviceToEdit.shortDescription}
                    onChange={(e) => setServiceToEdit({ ...serviceToEdit, shortDescription: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Description (for individual service page)</label>
                  <textarea
                    rows={3}
                    value={serviceToEdit.fullDescription}
                    onChange={(e) => setServiceToEdit({ ...serviceToEdit, fullDescription: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Image</label>
                  <div className="space-y-2">
                    {/* Image Preview */}
                    {serviceToEdit.imageUrl && (
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={serviceToEdit.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Preset Gallery Picker */}
                    <div className="text-[11px] text-slate-500 font-semibold">Select from Plumbing Photo Gallery:</div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Plumber', url: '/src/assets/images/hero_plumbing_service_1791015140754.jpg' },
                        { label: 'Tools', url: '/src/assets/images/plumber_work_tools_1791015154794.jpg' },
                        { label: 'Water Heater', url: '/src/assets/images/water_heater_inspection_1791015172595.jpg' },
                        { label: 'Central Florida', url: '/src/assets/images/sebring_florida_area_1791015185518.jpg' },
                      ].map((item) => (
                        <button
                          key={item.url}
                          type="button"
                          onClick={() => setServiceToEdit({ ...serviceToEdit, imageUrl: item.url })}
                          className={`p-1 rounded-lg border text-center transition-all ${
                            serviceToEdit.imageUrl === item.url ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50' : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <img src={item.url} alt={item.label} className="w-full h-12 object-cover rounded" />
                          <span className="text-[10px] font-bold text-slate-700 block mt-1 truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Or upload local image file */}
                    <div className="pt-1">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Or Upload Custom Image File:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setServiceToEdit({ ...serviceToEdit, imageUrl: event.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                      />
                    </div>

                    {/* Or custom URL */}
                    <div>
                      <input
                        type="text"
                        value={serviceToEdit.imageUrl || ''}
                        onChange={(e) => setServiceToEdit({ ...serviceToEdit, imageUrl: e.target.value })}
                        placeholder="Or enter direct image URL / path..."
                        className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="edit-enabled"
                    checked={serviceToEdit.enabled}
                    onChange={(e) => setServiceToEdit({ ...serviceToEdit, enabled: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                  <label htmlFor="edit-enabled" className="font-bold text-slate-700">Display this service on public website</label>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setServiceToEdit(null)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded">Save Service</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD SERVICE */}
        {/* ========================================================================= */}
        {showAddServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="text-base font-bold text-slate-900">Add New Plumbing Service</h3>
                <button type="button" onClick={() => setShowAddServiceModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleCreateService} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hydro-Jetting Sewer Cleaning"
                    value={newServiceForm.title}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief description for directory and homepage cards..."
                    value={newServiceForm.shortDescription}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, shortDescription: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Detail Description</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive description for dedicated service detail page..."
                    value={newServiceForm.fullDescription}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, fullDescription: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Photo</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[
                      { label: 'Plumber', url: '/src/assets/images/hero_plumbing_service_1791015140754.jpg' },
                      { label: 'Tools', url: '/src/assets/images/plumber_work_tools_1791015154794.jpg' },
                      { label: 'Water Heater', url: '/src/assets/images/water_heater_inspection_1791015172595.jpg' },
                      { label: 'Central Florida', url: '/src/assets/images/sebring_florida_area_1791015185518.jpg' },
                    ].map((item) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => setNewServiceForm({ ...newServiceForm, imageUrl: item.url })}
                        className={`p-1 rounded-lg border text-center transition-all ${
                          newServiceForm.imageUrl === item.url ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <img src={item.url} alt={item.label} className="w-full h-12 object-cover rounded" />
                        <span className="text-[10px] font-bold text-slate-700 block mt-1 truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setNewServiceForm({ ...newServiceForm, imageUrl: event.target.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setShowAddServiceModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded">Add Service</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: DELETE SERVICE CONFIRMATION */}
        {/* ========================================================================= */}
        {serviceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Delete Plumbing Service?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to permanently delete <strong>{serviceToDelete.title}</strong> from the website directory?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setServiceToDelete(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="button" onClick={handleDeleteService} className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded">Delete Service</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: EDIT ADMIN USER */}
        {/* ========================================================================= */}
        {userToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Edit Admin Account</h3>
                <button type="button" onClick={() => setUserToEdit(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleUpdateAdminUser} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userToEdit.name}
                    onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userToEdit.email}
                    onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Permissions</label>
                  <select
                    value={userToEdit.role}
                    onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="Super Admin">Super Admin (Full User & Site Management)</option>
                    <option value="Admin">Admin (Orders, Content & Service Management)</option>
                    <option value="Staff">Staff (Orders Viewing & Dispatch Status Only)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Status</label>
                  <select
                    value={userToEdit.status}
                    onChange={(e) => setUserToEdit({ ...userToEdit, status: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="active">Active (Access Allowed)</option>
                    <option value="disabled">Disabled (Access Blocked)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setUserToEdit(null)} className="px-4 py-2 rounded text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded font-bold text-white bg-sky-600 hover:bg-sky-500">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: DELETE ADMIN USER CONFIRMATION */}
        {/* ========================================================================= */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Delete Admin Account?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to permanently delete the admin account for <strong>{userToDelete.name}</strong> ({userToDelete.email})?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setUserToDelete(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="button" onClick={handleDeleteAdminUser} className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded">Delete Account</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD FAQ */}
        {/* ========================================================================= */}
        {showAddFaqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Add New FAQ</h3>
                <button type="button" onClick={() => setShowAddFaqModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleCreateFaq} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Do you service tankless water heaters?"
                    value={newFaqForm.question}
                    onChange={(e) => setNewFaqForm({ ...newFaqForm, question: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Answer</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detailed helpful answer for website visitors..."
                    value={newFaqForm.answer}
                    onChange={(e) => setNewFaqForm({ ...newFaqForm, answer: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newFaqForm.category}
                    onChange={(e) => setNewFaqForm({ ...newFaqForm, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Water Heaters">Water Heaters</option>
                    <option value="Drain Cleaning">Drain Cleaning</option>
                    <option value="Service Areas">Service Areas</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddFaqModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded">Create FAQ</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: EDIT FAQ */}
        {/* ========================================================================= */}
        {faqToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Edit FAQ</h3>
                <button type="button" onClick={() => setFaqToEdit(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSaveFaqEdit} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Question</label>
                  <input
                    type="text"
                    required
                    value={faqToEdit.question}
                    onChange={(e) => setFaqToEdit({ ...faqToEdit, question: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Answer</label>
                  <textarea
                    rows={4}
                    required
                    value={faqToEdit.answer}
                    onChange={(e) => setFaqToEdit({ ...faqToEdit, answer: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={faqToEdit.category || 'General'}
                    onChange={(e) => setFaqToEdit({ ...faqToEdit, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Water Heaters">Water Heaters</option>
                    <option value="Drain Cleaning">Drain Cleaning</option>
                    <option value="Service Areas">Service Areas</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setFaqToEdit(null)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded">Save FAQ</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: DELETE FAQ CONFIRMATION */}
        {/* ========================================================================= */}
        {faqToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Delete FAQ?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to permanently delete: "<strong>{faqToDelete.question}</strong>"?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFaqToDelete(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="button" onClick={handleDeleteFaq} className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded">Delete FAQ</button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CREATE MANUAL SERVICE ORDER */}
        {/* ========================================================================= */}
        {showCreateOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Create New Service Order</h3>
                <button type="button" onClick={() => setShowCreateOrderModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Smith"
                      value={newOrderForm.name}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(863) 555-0199"
                      value={newOrderForm.phone}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="customer@email.com"
                      value={newOrderForm.email}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Service Type</label>
                    <select
                      value={newOrderForm.serviceType}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, serviceType: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      {liveServices.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Property Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Street Name, Sebring, FL 33870"
                    value={newOrderForm.address}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, address: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Property</label>
                    <select
                      value={newOrderForm.propertyType}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, propertyType: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Urgency</label>
                    <select
                      value={newOrderForm.urgency}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, urgency: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Emergency (Immediate)">Emergency (Immediate)</option>
                      <option value="Today">Today</option>
                      <option value="Within 48 Hours">Within 48 Hours</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estimated Cost</label>
                    <input
                      type="text"
                      placeholder="$250 - $400"
                      value={newOrderForm.estimatedCost}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, estimatedCost: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Problem Description</label>
                  <textarea
                    rows={3}
                    placeholder="Details about the leak, clog, or water issue..."
                    value={newOrderForm.description}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign Technician</label>
                  <select
                    value={newOrderForm.assignedTechnician}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, assignedTechnician: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {TECHNICIANS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setShowCreateOrderModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded">Create & Dispatch</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
