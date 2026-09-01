import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  Check,
  Star,
  Sparkles,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('199.99');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState(categories[0]?.slug || 'electronics');
  const [brand, setBrand] = useState('ShopCloud');
  const [sku, setSku] = useState('SC-NEW-01');
  const [stock, setStock] = useState('25');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice('149.99');
    setOriginalPrice('199.99');
    setCategory(categories[0]?.slug || 'electronics');
    setBrand('ShopCloud');
    setSku(`SC-${Math.floor(1000 + Math.random() * 9000)}`);
    setStock('30');
    setImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setSlug(prod.slug);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setCategory(prod.category);
    setBrand(prod.brand);
    setSku(prod.sku);
    setStock(prod.stock.toString());
    setImage(prod.image);
    setIsFeatured(prod.isFeatured || false);
    setIsBestSeller(prod.isBestSeller || false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price) || 0;
    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const parsedStock = parseInt(stock, 10) || 0;

    const discountPercentage =
      parsedOriginalPrice && parsedOriginalPrice > parsedPrice
        ? Math.round(((parsedOriginalPrice - parsedPrice) / parsedOriginalPrice) * 100)
        : undefined;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        discountPercentage,
        category,
        brand,
        sku,
        stock: parsedStock,
        image,
        images: [image],
        isFeatured,
        isBestSeller,
      });
    } else {
      addProduct({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        detailedDescription: description,
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        discountPercentage,
        category,
        brand,
        sku,
        stock: parsedStock,
        rating: 5.0,
        reviewCount: 1,
        image,
        images: [image],
        features: ['Premium construction', '1-year warranty included'],
        specifications: { Category: category, Brand: brand },
        isFeatured,
        isBestSeller,
      });
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchSku) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Catalog & Products</h2>
          <p className="text-xs text-slate-500">Create, edit, adjust pricing, and delete inventory items</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none"
          >
            <option value="all">All Departments</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU / Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {p.isFeatured && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                              Featured
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-800 block">{p.sku}</span>
                    <span className="text-[11px] text-slate-400">{p.brand}</span>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-700">
                    {p.category.replace('-', ' ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">${p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through block">
                        ${p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock === 0
                          ? 'bg-rose-100 text-rose-700'
                          : p.stock <= 5
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span className="font-bold text-slate-800">{p.rating.toFixed(1)}</span>
                      <span className="text-slate-400">({p.reviewCount})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-lg transition"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        title="Delete product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingProductId ? 'Edit Product' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (MSRP for Discount %)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 299.99"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-mono focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory Units in Stock</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-semibold text-slate-700">Display in Featured Section</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-semibold text-slate-700">Mark as Best Seller</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
