"use client";
import { useState, useEffect } from "react";
import { useCheckoutStore } from "@/lib/store";
import { 
  Search, Filter, Plus, Edit2, AlertTriangle, TrendingUp, PackagePlus, X, UploadCloud, Image as ImageIcon, Loader2
} from "lucide-react";

export default function InventoryPage() {
  const { products, fetchProducts, addProductToDB, updateProductStockInDB, isLoadingProducts } = useCheckoutStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load products from Supabase when the page opens!
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Edit State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Product State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", category: "University", price: 48, originalPrice: 50, stock: 10, description: ""
  });
  
  // We need to keep track of the actual File for Supabase
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filteredInventory = products.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickRestock = async (id: string, currentStock: number, amountToAdd: number) => {
    await updateProductStockInDB(id, currentStock + amountToAdd);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setIsUpdating(true);
    await updateProductStockInDB(editingProduct.id, editStockValue);
    setIsUpdating(false);
    setEditingProduct(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file); // Save the file for Supabase
      
      // Create a local preview URL so you can see it instantly
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please upload a design image!");
      return;
    }

    setIsUploading(true);
    
    // Call our new Supabase function!
    const success = await addProductToDB(newProduct, uploadFile);
    
    if (success) {
      setIsAddingProduct(false);
      setUploadFile(null);
      setPreviewUrl(null);
      setNewProduct({ name: "", category: "University", price: 48, originalPrice: 50, stock: 10, description: "" });
    }
    
    setIsUploading(false);
  };

  const getStatus = (stock: number) => stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock";

  const getStatusBadge = (stock: number) => {
    const status = getStatus(stock);
    switch (status) {
      case "In Stock": return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">In Stock</span>;
      case "Low Stock": return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Low Stock</span>;
      case "Out of Stock": return <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>;
      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" placeholder="Search by name or category..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D4537E]" 
          />
        </div>
        <button onClick={() => setIsAddingProduct(true)} className="bg-[#D4537E] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#b8436b] shadow-sm flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add New Design
        </button>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] relative">
        
        {isLoadingProducts && products.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-[#D4537E] animate-spin mb-4" />
            <p className="text-gray-500 text-sm font-medium">Fetching from Supabase...</p>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Current Stock</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.length === 0 && !isLoadingProducts ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products in your database yet! Add your first design above.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.imagePath ? (
                           <img src={item.imagePath} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.stock)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className={`font-bold ${item.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>{item.stock}</span>
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleQuickRestock(item.id, item.stock, 5)} className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">+5</button>
                          <button onClick={() => handleQuickRestock(item.id, item.stock, 10)} className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">+10</button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">₱{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditingProduct(item); setEditStockValue(item.stock); }} className="p-2 text-gray-400 hover:text-[#D4537E] hover:bg-[#FBEAF0] rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD NEW PRODUCT DRAWER --- */}
      {isAddingProduct && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsAddingProduct(false)} />
          <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col border-l border-gray-200 animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Add New Design</h2>
              <button onClick={() => setIsAddingProduct(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddNewProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Design Image</label>
                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden ${previewUrl ? 'border-[#71A051] bg-black' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-90" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-600">Click to upload design</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm" placeholder="e.g., CCIS Exclusive Beep" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm appearance-none">
                  <option value="University">University</option>
                  <option value="College editions">College editions</option>
                  <option value="Sanrio">Sanrio</option>
                  <option value="Coquette">Coquette</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (₱)</label>
                  <input required type="number" min="0" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Initial Stock</label>
                  <input required type="number" min="1" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea required rows={3} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm resize-none" placeholder="Short description for the product page..." />
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-3">
                <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={isUploading} className="flex-1 py-3 rounded-xl bg-[#D4537E] text-white font-medium hover:bg-[#b8436b] shadow-sm transition-colors text-sm flex items-center justify-center">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish to Database'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* QUICK EDIT DRAWER REMAINS THE SAME... */}
      {editingProduct && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setEditingProduct(null)} />
          <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col border-l border-gray-200 animate-in slide-in-from-right">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Edit Inventory</h2>
              <button onClick={() => setEditingProduct(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
                <input type="text" value={editingProduct.name} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-xl p-5">
                <label className="block text-sm font-bold text-gray-900 mb-1">Stock Quantity</label>
                <p className="text-xs text-gray-500 mb-4">Adjust the current physical stock count.</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setEditStockValue(Math.max(0, editStockValue - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold text-xl">-</button>
                  <input type="number" value={editStockValue} onChange={(e) => setEditStockValue(parseInt(e.target.value) || 0)} className="w-20 text-center font-bold text-2xl bg-transparent border-b-2 border-gray-300 focus:border-[#D4537E] focus:outline-none pb-1" />
                  <button onClick={() => setEditStockValue(editStockValue + 1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold text-xl">+</button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button onClick={() => setEditingProduct(null)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm">Cancel</button>
              <button onClick={handleSaveEdit} disabled={isUpdating} className="flex-1 py-3 rounded-xl bg-[#D4537E] text-white font-medium hover:bg-[#b8436b] shadow-sm transition-colors text-sm flex justify-center">
                 {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}