"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Adjust path to your supabase client
import { Mail, Users, Send, CheckSquare, Plus, Trash2, X } from "lucide-react";

export default function OutreachHub() {
  const [leads, setLeads] = useState<any[]>([]); 
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'pitch' | 'followup' | 'promo'>('pitch');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ org_name: '', contact_person: '', contact_info: '' });

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('Lead')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setLeads(data);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (selectedTemplate === 'pitch') {
      setCustomSubject(`Polycrafted Partnership Inquiry — [Institution]`);
      setCustomBody(`Hi [Contact Person],\n\nWe noticed [Institution] has some upcoming events, and we'd love to help you source high-quality, custom-crafted items for your members or attendees.\n\nAt Polycrafted, we specialize in bulk orders with reliable turnaround times and premium quality.\n\nLet us know if you have 5 minutes this week to chat!\n\nBest,\nThe Polycrafted Team`);
    } else if (selectedTemplate === 'followup') {
      setCustomSubject(`Checking in — Polycrafted for [Institution]`);
      setCustomBody(`Hi [Contact Person],\n\nJust floating this back to the top of your inbox. Let me know if [Institution] is still looking for custom merchandise or bulk items this semester.\n\nBest,\nThe Polycrafted Team`);
    } else {
      setCustomSubject(`Exclusive Polycrafted Discount for [Institution] Members`);
      setCustomBody(`Hi [Contact Person],\n\nWe’ve generated a special code exclusively for [Institution]. Share this with your members for 15% off their next Polycrafted order!\n\nCode: [Institution]-15\n\nBest,\nThe Polycrafted Team`);
    }
  }, [selectedTemplate]);

  // --- ACTIONS ---
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.org_name) return alert("Organization name is required.");
    
    setIsProcessing(true);
    const { error } = await supabase.from('Lead').insert([{ ...leadForm, status: 'TARGET' }]);
    
    if (error) {
      alert("Error adding target: " + error.message);
    } else {
      setIsLeadModalOpen(false);
      setLeadForm({ org_name: '', contact_person: '', contact_info: '' });
      fetchLeads();
    }
    setIsProcessing(false);
  };

  const handleDeleteLead = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from your targets?`)) return;
    
    const { error } = await supabase.from('Lead').delete().eq('id', id);
    if (!error) {
      fetchLeads();
      // Uncheck it if it was selected
      setSelectedLeadIds(prev => prev.filter(selectedId => selectedId !== id.toString()));
    }
  };

  const handleMassSend = async () => {
    if (selectedLeadIds.length === 0) return alert("Please select at least one organization.");
    
    const recipients = leads
      .filter(l => selectedLeadIds.includes(l.id.toString()) && l.contact_info)
      .map(l => ({ email: l.contact_info, name: l.org_name }));

    if (recipients.length === 0) return alert("No valid email addresses selected.");
    if (!window.confirm(`Ready to blast ${recipients.length} emails?`)) return;

    setIsSendingEmails(true);
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipients,
          subject: customSubject,
          messageTemplate: customBody,
          attachmentUrl: attachmentUrl,
          imageUrl: imageUrl 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🚀 Successfully sent ${data.sent} emails!`);
        setSelectedLeadIds([]);
      } else {
        alert("Error sending emails: " + data.message);
      }
    } catch (error) {
      alert("Network Error.");
    }
    setIsSendingEmails(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Mail className="w-8 h-8 text-[#D4537E]" /> Email Outreach Hub
        </h1>
        <p className="text-gray-500 font-medium text-sm">Manage targets, craft strategies, and deploy mass email campaigns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Targets & Strategy */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Target Selector */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4537E]" /> Select Targets
              </h3>
              <div className="flex gap-3 items-center">
                <button 
                  onClick={() => setIsLeadModalOpen(true)} 
                  className="text-[10px] bg-[#FBEAF0] text-[#D4537E] font-bold uppercase px-2 py-1 rounded flex items-center gap-1 hover:bg-[#D4537E] hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Lead
                </button>
                <button 
                  onClick={() => setSelectedLeadIds(selectedLeadIds.length === leads.length && leads.length > 0 ? [] : leads.map(l => l.id.toString()))} 
                  className="text-[10px] text-gray-500 font-bold uppercase hover:text-[#D4537E]"
                >
                  {selectedLeadIds.length === leads.length && leads.length > 0 ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
              {leads.length === 0 ? (
                <p className="text-xs text-gray-500 font-medium text-center py-4">No organizations added to database yet.</p>
              ) : (
                leads.map(lead => (
                  <div key={lead.id} className="group flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 shadow-sm">
                    <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={selectedLeadIds.includes(lead.id.toString())} 
                        onChange={(e) => {
                          if (e.target.checked) setSelectedLeadIds([...selectedLeadIds, lead.id.toString()]);
                          else setSelectedLeadIds(selectedLeadIds.filter(id => id !== lead.id.toString()));
                        }} 
                        className="w-4 h-4 accent-[#D4537E] rounded" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{lead.org_name}</p>
                        <p className="text-[9px] text-gray-500 truncate">{lead.contact_info || 'No Email'}</p>
                      </div>
                    </label>
                    <button 
                      onClick={() => handleDeleteLead(lead.id, lead.org_name)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete Target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Strategy Selector */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#D4537E]" /> Strategy Template
            </h3>
            <div className="space-y-3">
              {[
                { id: 'pitch', title: 'Cold Pitch', desc: 'Initial B2B partnership request.' },
                { id: 'followup', title: 'The Follow-Up', desc: 'Reminder for unresponsive leads.' },
                { id: 'promo', title: 'Promo Blast', desc: 'Send an exclusive Polycrafted code.' }
              ].map(tmpl => (
                <label key={tmpl.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedTemplate === tmpl.id ? 'bg-[#FBEAF0] border-[#D4537E]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="template" value={tmpl.id} checked={selectedTemplate === tmpl.id} onChange={() => setSelectedTemplate(tmpl.id as any)} className="w-4 h-4 accent-[#D4537E]" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">{tmpl.title}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{tmpl.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Composer & Blast */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full min-h-[500px]">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#D4537E]" /> Composer & Output
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Subject Line</label>
              <span className="text-[8px] font-bold text-[#D4537E] bg-[#FBEAF0] px-2 py-0.5 rounded">Leaves [Institution] to auto-inject names</span>
            </div>
            <input 
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-bold text-gray-800 shadow-sm outline-none focus:border-[#D4537E] transition-colors" 
            />
          </div>

          <div className="flex-1 flex flex-col mb-4">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Email Body</label>
            <textarea 
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              className="w-full flex-1 bg-white border border-gray-200 rounded-xl p-6 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-[#D4537E] resize-none min-h-[250px] transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">PDF Attachment (URL)</label>
              <input 
                type="url" 
                placeholder="e.g. https://supabase.co/proposal.pdf"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 outline-none focus:border-[#D4537E] shadow-sm"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Inline Image Banner (URL)</label>
              <input 
                type="url" 
                placeholder="e.g. https://supabase.co/banner.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 outline-none focus:border-[#D4537E] shadow-sm"
              />
            </div>
          </div>

          <button 
            onClick={handleMassSend}
            disabled={isSendingEmails || selectedLeadIds.length === 0}
            className={`mt-6 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex justify-center items-center gap-2 ${selectedLeadIds.length > 0 ? 'bg-[#D4537E] hover:bg-[#b04065] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {isSendingEmails ? (
               <><span className="animate-spin">⏳</span> Sending to {selectedLeadIds.length} partners...</>
            ) : (
               <><Send className="w-4 h-4" /> Blast Emails to {selectedLeadIds.length} Partners</>
            )}
          </button>
        </div>
      </div>

      {/* ADD TARGET MODAL */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[24px] p-8 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Add Target Lead</h3>
                <button onClick={() => setIsLeadModalOpen(false)} className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <form onSubmit={handleAddLead} className="space-y-4">
               <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Organization / Dept Name</label>
                 <input 
                  type="text" 
                  value={leadForm.org_name} 
                  onChange={e => setLeadForm({...leadForm, org_name: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#D4537E] focus:bg-white transition-colors" 
                  placeholder="e.g. PUP Marketing Society" 
                  required
                 />
               </div>
               <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Contact Person <span className="text-gray-400 normal-case">(Optional)</span></label>
                 <input 
                  type="text" 
                  value={leadForm.contact_person} 
                  onChange={e => setLeadForm({...leadForm, contact_person: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#D4537E] focus:bg-white transition-colors" 
                  placeholder="Leave blank if unknown" 
                 />
               </div>
               <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Email Address</label>
                 <input 
                  type="email" 
                  value={leadForm.contact_info} 
                  onChange={e => setLeadForm({...leadForm, contact_info: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#D4537E] focus:bg-white transition-colors" 
                  placeholder="e.g. org@pup.edu.ph" 
                  required
                 />
               </div>
               
               <button 
                type="submit" 
                disabled={isProcessing} 
                className="w-full mt-6 bg-[#D4537E] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#b04065] transition-colors shadow-md"
               >
                 {isProcessing ? 'Saving...' : 'Save Lead'}
               </button>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}