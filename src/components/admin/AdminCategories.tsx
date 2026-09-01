import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Category } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Layers,
  ShoppingBag,
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('ShoppingBag');

  const handleOpenAddModal = () => {
    setEditingCatId(null);
    setName('');
    setSlug('');
    setDescription('');
    setIconName('ShoppingBag');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIconName(cat.iconName || 'ShoppingBag');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    if (editingCatId) {
      updateCategory(editingCatId, {
        name,
        slug: generatedSlug,
        description,
        iconName,
      });
    } else {
      addCategory({
        name,
        slug: generatedSlug,
        description,
        iconName,
        itemCount: 0,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Product Departments & Categories</h2>
          <p className="text-xs text-slate-500">Configure catalog taxonomy, department icons, and navigation groupings</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full">
                    {productCount} Items
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">{cat.name}</h3>
                <p className="text-xs font-mono text-indigo-600 mt-0.5">/{cat.slug}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {categories.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${cat.name}"?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingCatId ? 'Edit Department Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Home & Lighting"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="smart-home"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-mono focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description for SEO and catalog browser..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Icon Type</label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value="ShoppingBag">Shopping Bag (Generic)</option>
                  <option value="Headphones">Headphones (Audio)</option>
                  <option value="Watch">Watch (Wearables)</option>
                  <option value="Laptop">Laptop (Computing)</option>
                  <option value="Home">Home (Living & Tech)</option>
                  <option value="Camera">Camera (Photography)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingCatId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
