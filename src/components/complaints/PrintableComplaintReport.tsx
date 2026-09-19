import React from 'react';
import { Complaint } from '../../types';
import { Wrench, CheckCircle, Shield, Phone, MapPin, Calendar, Clock } from 'lucide-react';

interface PrintableComplaintReportProps {
  complaint: Complaint;
}

export const PrintableComplaintReport: React.FC<PrintableComplaintReportProps> = ({ complaint }) => {
  return (
    <div id="printable-report" className="bg-white p-8 text-slate-900 font-sans max-w-4xl mx-auto border border-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">FixMate Service Report</h1>
              <p className="text-xs text-slate-500 font-medium">Smart Complaint & Technical Maintenance Dispatch</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold uppercase text-slate-400">Official Ticket No.</div>
          <div className="text-xl font-mono font-extrabold text-indigo-600">{complaint.complaintId}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-6 my-6 border-b border-slate-200 pb-6 text-xs">
        
        {/* Customer Information */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Customer & Location</h3>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <p><strong className="text-slate-600">Name:</strong> {complaint.userName}</p>
            <p><strong className="text-slate-600">Email:</strong> {complaint.userEmail}</p>
            <p><strong className="text-slate-600">Phone:</strong> {complaint.userPhone || 'N/A'}</p>
            <p><strong className="text-slate-600">Location:</strong> {complaint.location}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Ticket Specification</h3>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <p><strong className="text-slate-600">Category:</strong> {complaint.category}</p>
            <p><strong className="text-slate-600">Priority Level:</strong> {complaint.priority}</p>
            <p><strong className="text-slate-600">Current Status:</strong> <span className="font-bold text-indigo-600">{complaint.status}</span></p>
            <p><strong className="text-slate-600">Preferred Date:</strong> {complaint.preferredDate}</p>
          </div>
        </div>

      </div>

      {/* Problem Description & AI Diagnosis */}
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reported Problem Description</h3>
          <div className="mt-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800">
            {complaint.description}
          </div>
        </div>

        {complaint.aiAnalysis && (
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Diagnostic Analysis & Safety Steps</h3>
            <div className="mt-1.5 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs space-y-1.5">
              <p><strong className="text-indigo-900">Diagnosis:</strong> {complaint.aiAnalysis.problemSummary}</p>
              <p><strong className="text-indigo-900">Safety / Prep Guidance:</strong> {complaint.aiAnalysis.suggestedNextStep}</p>
            </div>
          </div>
        )}
      </div>

      {/* Assigned Technician & Work Log */}
      <div className="my-6 border-b border-slate-200 pb-6 text-xs space-y-3">
        <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Assigned Specialist & Service Execution</h3>
        
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <div className="font-bold text-slate-900">{complaint.assignedTechnicianName || 'Unassigned / Pending Dispatch'}</div>
            <div className="text-slate-500">Contact: {complaint.assignedTechnicianPhone || 'FixMate Central Desk'}</div>
          </div>
          <div className="text-right">
            <span className="inline-block rounded bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-800">
              {complaint.category} Certified
            </span>
          </div>
        </div>

        {/* Work notes if available */}
        {complaint.workNotes && complaint.workNotes.length > 0 && (
          <div className="space-y-2 mt-3">
            <h4 className="font-semibold text-slate-700">Technician Log & Parts Installed:</h4>
            {complaint.workNotes.map(note => (
              <div key={note.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Log by: <strong>{note.author}</strong> ({note.role})</span>
                  <span>{new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <div className="mt-1 text-slate-800">{note.note}</div>
                {note.partsUsed && (
                  <div className="mt-1 text-[11px] text-indigo-700 font-medium">
                    Parts Replaced / Used: {note.partsUsed}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {complaint.resolutionSummary && (
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
            <strong className="text-emerald-900">Resolution Sign-off:</strong> {complaint.resolutionSummary}
          </div>
        )}
      </div>

      {/* Signatures & Footer */}
      <div className="grid grid-cols-2 gap-12 pt-8 text-xs">
        <div>
          <div className="border-b border-slate-400 pb-12"></div>
          <p className="mt-2 font-semibold text-slate-700">Technician Signature & Date</p>
        </div>
        <div>
          <div className="border-b border-slate-400 pb-12"></div>
          <p className="mt-2 font-semibold text-slate-700">Customer Acceptance & Date</p>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
        FixMate Complaint & Service Management Platform • https://fixmate.app • 24/7 Helpline: 1-800-FIX-MATE
      </div>

    </div>
  );
};
