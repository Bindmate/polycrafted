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

  // --- UPDATED EMAIL TEMPLATES ---
  useEffect(() => {
    if (selectedTemplate === 'pitch') {
      setCustomSubject(`Partnership Inquiry: Polycrafted x [Institution] Student Organization`);
      setCustomBody(`Blessed day,\n\nI hope this message finds your organization well. My name is Nicholas Quintela, Partnership and Promotions Officer of Polycrafted — a student-run craft brand from PUP that produces premium beep card stickers across 29+ designs, including university-themed, Sanrio, and lifestyle collections.\n\nWe are currently extending Official Event Partnership invitations to select student organizations this semester, and we believe [Institution] would be a strong fit for a mutual collaboration.\n\nThe partnership is structured as follows:\n\n• 5 Beep Card Sticker pairs — provided to your organization for use as event giveaways or raffle prizes\n• 30 Sticker pairs distributed on-site — handed directly to students at your event booth by our team\n• 30 exclusive discount vouchers — redeemable by your members on any design at polycrafted.vercel.app\n• 100 pages of bond printing — available for your organization's internal documents, forms, and official correspondence\n\nThis arrangement requires no financial commitment from your organization. In exchange, we request a 60 follows on our facebook page and a modest level of social media engagement on one promotional post we will provide — the specifics of which remain open to discussion.\n\nI have linked our <a href="https://drive.google.com/drive/folders/1Kwb5xh8I4hVnC1aV-fhIgoW9xt1KGG2L?usp=sharing" target="_blank" style="color: #D4537E; text-decoration: underline;">Official Partnership Proposal here</a> for your Executive Board's review. It outlines the full terms, our product catalog, and what both parties can expect from the collaboration. We are open to adjusting the arrangement to better suit your organization's needs.\n\nIf your organization is interested, please reply to this message at your earliest convenience. We aim to finalize partnerships on or before [Date] to ensure everything is in order ahead of your upcoming events.\n\nWe look forward to the possibility of collaborating with [Institution] this semester.\n\n<b>Crafting connections through unique collectibles,</b>`);
    } else if (selectedTemplate === 'followup') {
      setCustomSubject(`Follow-Up: Partnership Proposal — Polycrafted x [Institution]`);
      setCustomBody(`Blessed day,\n\nI wanted to follow up on our previous message regarding a potential event partnership between Polycrafted and [Institution].\n\nIf you are not the appropriate point of contact for external partnerships, we would appreciate being directed to your VP for Externals or equivalent officer.\n\nTo briefly recap the collaboration we proposed:\n\n• 35 Beep Card Sticker pairs for your organization's events — 5 reserved for giveaways or raffle prizes, and 30 distributed live at your booth by our team\n• 30 exclusive discount vouchers for your members to redeem on any design from our catalog\n• 100 pages of bond printing for your organization's internal documents and correspondence\n\nThere is no financial obligation on your organization's end.\n\nWe understand calendars fill up quickly, and we are reaching out now because we allocate a limited number of Official Partner slots per semester to ensure each collaboration receives proper attention. Confirming your interest early also means your members will have access to the vouchers well ahead of your next event.\n\nI have linked the <a href="https://drive.google.com/drive/folders/1Kwb5xh8I4hVnC1aV-fhIgoW9xt1KGG2L?usp=sharing" target="_blank" style="color: #D4537E; text-decoration: underline;">partnership proposal here</a> for your Executive Board's reference. If [Institution] is open to moving forward, please reply to this message and we can schedule a time to discuss the details.\n\nThank you for your time, and we hope to hear from you soon.\n\n<b>Crafting connections through unique collectibles,</b>`);
    } else {
      setCustomSubject(`Member Benefit Offer: Polycrafted x [Institution] — Discount Code Included`);
      setCustomBody(`Blessed day,\n\nAs part of our ongoing outreach to student organizations this semester, we would like to extend an immediate member benefit to [Institution] — no formal agreement required to get started.\n\nYour organization can share the code PARTNERPOLYCRAFTED with your members today. It unlocks 25% off any beep card sticker design from our catalog at polycrafted.vercel.app/catalog — a small but practical perk for students who commute regularly.\n\nThis is also an entry point into our full Official Event Partnership, which includes:\n\n• 35 Beep Card Sticker pairs designated for your events — 5 for org giveaways or raffle prizes, plus 30 distributed on-site at your booth\n• 30 exclusive discount vouchers for your members\n• 100 pages of bond printing for internal org use\n\nThe full partnership involves no financial commitment from [Institution].\n\nI have linked our <a href="https://drive.google.com/drive/folders/1Kwb5xh8I4hVnC1aV-fhIgoW9xt1KGG2L?usp=sharing" target="_blank" style="color: #D4537E; text-decoration: underline;">Official Partnership Proposal here</a> for your Executive Board's review. If your organization would like to formalize the arrangement, please reply to this message and we will take it from there.\n\nWe hope this is a useful starting point for [Institution] and its members.\n\n<b>Crafting connections through unique collectibles,</b>`);
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
          messageTemplate: customBody
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