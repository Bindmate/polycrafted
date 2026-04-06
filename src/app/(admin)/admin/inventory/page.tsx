"use client";
import { useState, useEffect } from "react";
import { useCheckoutStore } from "@/lib/store";
import { 
  Search, Filter, Plus, Edit2, AlertTriangle, TrendingUp, PackagePlus, X, UploadCloud, Image as ImageIcon, Loader2, Layers
} from "lucide-react";

export default function InventoryPage() {
  const { products, fetchProducts, addProductToDB, updateProductStockInDB, isLoadingProducts } = useCheckoutStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // ADD PRODUCT STATE
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // THE NEW BACK-TO-BACK TOGGLE
  const [isBackToBack, setIsBackToBack] = useState(false);
  
  const [newProduct, setNewProduct] = useState({ name: "", category: "University", price: 48, originalPrice: 50, stock: 10, description: "" });
  
  // DUAL IMAGE STATE
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const filteredInventory = products.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Image Handler supporting both front and back
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setFrontFile(file);
          setFrontPreview(reader.result as string);
        } else {
          setBackFile(file);
          setBackPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile) { alert("Please upload a Front Design!"); return; }
    if (isBackToBack && !backFile) { alert("Please upload a Back Design!"); return; }

    setIsUploading(true);
    
    const success = await addProductToDB(newProduct, frontFile, isBackToBack ? backFile : null);
    
    if (success) {
      setIsAddingProduct(false);
      setFrontFile(null); setFrontPreview(null);
      setBackFile(null); setBackPreview(null);
      setIsBackToBack(false);
      setNewProduct({ name: "", category: "University", price: 48, originalPrice: 50, stock: 10, description: "" });
    }
    
    setIsUploading(false);
  };

  const getStatus = (stock: number) => stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock";
  const getStatusBadge = (stock: number) => {
    const status = getStatus(stock);
    if (status === "In Stock") return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">In Stock</span>;
    if (status === "Low Stock") return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" /> Low Stock</span>;
    return <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>;
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
        {isLoadingProducts && products.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-[#D4537E] animate-spin mb-4" />
            <p className="text-gray-500 text-sm font-medium">Fetching from Supabase...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.frontImage ? <img src={item.frontImage} alt={item.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.backImage ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md w-fit">
                        <Layers className="w-3.5 h-3.5" /> Back-to-Back
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500">Solo Design</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.stock)}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900">
                     {editingProduct?.id === item.id ? (
                        <div className="flex items-center justify-center gap-2">
                           <input type="number" min="0" value={editStockValue} onChange={(e) => setEditStockValue(parseInt(e.target.value) || 0)} className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                           <button onClick={handleSaveEdit} disabled={isUpdating} className="text-emerald-600 font-bold text-xs hover:underline">{isUpdating ? '...' : 'Save'}</button>
                           <button onClick={() => setEditingProduct(null)} className="text-gray-400 font-bold text-xs hover:underline">Cancel</button>
                        </div>
                     ) : (
                        item.stock
                     )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">₱{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditingProduct(item); setEditStockValue(item.stock); }} className="p-2 text-gray-400 hover:text-[#D4537E] hover:bg-[#FBEAF0] rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
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
              
              <div className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-xl p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsBackToBack(!isBackToBack)}>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Layers className="w-4 h-4 text-[#D4537E]" /> Back-to-Back Design?</h3>
                  <p className="text-xs text-gray-500 mt-1">Enable this if you have a separate back image.</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${isBackToBack ? 'bg-[#D4537E]' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isBackToBack ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
              </div>

              <div className={`grid ${isBackToBack ? 'grid-cols-2' : 'grid-cols-1'} gap-4 transition-all`}>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Front Design</label>
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden ${frontPreview ? 'border-[#71A051] bg-black' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                    {frontPreview ? <img src={frontPreview} alt="Front" className="w-full h-full object-cover opacity-90" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'front')} />
                  </label>
                </div>
                {isBackToBack && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Back Design</label>
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden ${backPreview ? 'border-[#71A051] bg-black' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                      {backPreview ? <img src={backPreview} alt="Back" className="w-full h-full object-cover opacity-90" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'back')} />
                    </label>
                  </div>
                )}
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

              {/* INJECTED: Product Description Textarea */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required 
                  value={newProduct.description} 
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#D4537E] outline-none rounded-xl px-4 py-2.5 text-sm resize-none" 
                  rows={3}
                  placeholder="Describe the aesthetic and material..."
                />
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
    </div>
  );
}