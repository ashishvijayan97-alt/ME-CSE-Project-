import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Address } from '../../types';
import {
  User,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Package,
  Heart,
  Shield,
  LogOut,
  Save,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    orders,
    wishlist,
    logout,
    setActivePage,
    addToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  // Edit profile info state
  const [userName, setUserName] = useState(currentUser?.name || 'Alex Morgan');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'alex.morgan@example.com');
  const [userAvatar, setUserAvatar] = useState(
    currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );

  // Address modal states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formFullName, setFormFullName] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formApartment, setFormApartment] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('CA');
  const [formPostal, setFormPostal] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: userName,
        email: userEmail,
        avatar: userAvatar,
      });
      addToast('success', 'Profile Updated', 'Your user information has been saved successfully.');
    }
  };

  const handleOpenAddressModal = (addr?: Address) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setFormFullName(addr.fullName);
      setFormStreet(addr.street);
      setFormApartment(addr.apartment || '');
      setFormCity(addr.city);
      setFormState(addr.state);
      setFormPostal(addr.postalCode);
      setFormPhone(addr.phone);
      setFormIsDefault(addr.isDefault);
    } else {
      setEditingAddressId(null);
      setFormFullName(userName);
      setFormStreet('');
      setFormApartment('');
      setFormCity('');
      setFormState('CA');
      setFormPostal('');
      setFormPhone('');
      setFormIsDefault(addresses.length === 0);
    }
    setIsEditingAddress(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName || !formStreet || !formCity || !formPostal) return;

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        fullName: formFullName,
        street: formStreet,
        apartment: formApartment,
        city: formCity,
        state: formState,
        postalCode: formPostal,
        phone: formPhone,
        isDefault: formIsDefault,
      });
    } else {
      addAddress({
        fullName: formFullName,
        street: formStreet,
        apartment: formApartment,
        city: formCity,
        state: formState,
        postalCode: formPostal,
        country: 'United States',
        phone: formPhone || '+1 (555) 000-0000',
        isDefault: formIsDefault,
        type: 'home',
      });
    }
    setIsEditingAddress(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('error', 'Mismatch Error', 'New passwords do not match.');
      return;
    }
    addToast('success', 'Password Updated', 'Your security password was changed with bcrypt hashing simulation.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={userAvatar}
            alt={userName}
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{userName}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {currentUser?.role === 'admin' ? 'Administrator' : 'Verified Member'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{userEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActivePage('admin')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Open Admin Portal
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'addresses'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Address Book ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Passwords</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          {/* TAB 1: Profile Info */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Update Account Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={userAvatar}
                    onChange={(e) => setUserAvatar(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </form>
          )}

          {/* TAB 2: Address Book */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Manage Saved Addresses</h3>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">
                        {addr.street} {addr.apartment}
                      </p>
                      <p className="text-xs text-slate-600">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2">{addr.phone}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-200/60">
                      <button
                        onClick={() => handleOpenAddressModal(addr)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 font-medium transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      {addresses.length > 1 && (
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 text-xs flex items-center gap-1 font-medium transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add/Edit Modal */}
              {isEditingAddress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                    <h4 className="text-base font-bold text-slate-900">
                      {editingAddressId ? 'Edit Address' : 'Add New Shipping Address'}
                    </h4>

                    <form onSubmit={handleSaveAddress} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formFullName}
                          onChange={(e) => setFormFullName(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          value={formStreet}
                          onChange={(e) => setFormStreet(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={formCity}
                            onChange={(e) => setFormCity(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={formState}
                            onChange={(e) => setFormState(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Zip Code</label>
                          <input
                            type="text"
                            required
                            value={formPostal}
                            onChange={(e) => setFormPostal(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={formIsDefault}
                          onChange={(e) => setFormIsDefault(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-xs font-medium text-slate-700">Set as default shipping address</span>
                      </label>

                      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security & Passwords */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Security & Authentication
              </h3>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900">
                <p className="font-bold mb-1">Flask-Bcrypt Password Protection</p>
                <p className="text-slate-600">
                  Passwords are authenticated against salted cryptographic hashes using Flask-Bcrypt on the backend.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
