'use client';

import React, { useState } from 'react';
import { CheckCircle, Download, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { downloadNotice, NOTICE_LANGUAGES } from '@/lib/noticeLanguages';

export const StepSuccess = ({ formData }: {
  formData: any;
  updateFormData?: (updates: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  selectedLanguage?: string;
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const languageLabel = NOTICE_LANGUAGES.find((l) => l.code === selectedLanguage)?.label ?? 'English';

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    doc.setFillColor(249, 115, 22); // orange-500
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Sierra Pacific Builders', margin, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Employee Compliance Portal', margin, 23);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth - margin, 23, { align: 'right' });

    y = 50;
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Compliance Acknowledgement', margin, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('California Workplace - Know Your Rights Act (SB 294)', margin, y);
    y += 15;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    doc.setFillColor(220, 252, 231);
    doc.roundedRect(margin, y - 6, 60, 10, 2, 2, 'F');
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SIGNED & VERIFIED', margin + 5, y + 1);
    y += 16;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'S');
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Compliance Details', margin + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(`Date of Acknowledgement:`, margin + 5, y + 17);
    doc.setTextColor(17, 24, 39);
    doc.text(`${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, margin + 65, y + 17);
    doc.setTextColor(75, 85, 99);
    doc.text(`Notice Version:`, margin + 5, y + 25);
    doc.setTextColor(17, 24, 39);
    doc.text(`2026 California Workplace Know Your Rights Notice`, margin + 65, y + 25);
    y += 45;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Emergency Contact Designation', margin, y);
    y += 8;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    if (formData.authorizeDetention) {
      doc.setFillColor(255, 237, 213);
      doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F');
      doc.setDrawColor(253, 186, 116);
      doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'S');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(234, 88, 12);
      doc.text('Authorized', margin + 5, y + 8);
      doc.setTextColor(75, 85, 99);
      doc.setFont('helvetica', 'normal');
      doc.text('Contact Name:', margin + 5, y + 18);
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.text(formData.contactName, margin + 45, y + 18);
      doc.setTextColor(75, 85, 99);
      doc.setFont('helvetica', 'normal');
      doc.text('Phone Number:', margin + 5, y + 26);
      doc.setTextColor(17, 24, 39);
      doc.text(formData.contactPhone, margin + 45, y + 26);
      if (formData.contactRelationship) {
        doc.setTextColor(75, 85, 99);
        doc.setFont('helvetica', 'normal');
        doc.text('Relationship:', margin + 5, y + 34);
        doc.setTextColor(17, 24, 39);
        doc.text(formData.contactRelationship, margin + 45, y + 34);
      }
      y += 50;
    } else {
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, y, contentWidth, 16, 3, 3, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text('Employee opted out of emergency contact designation.', margin + 5, y + 10);
      y += 26;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Employee Signature', margin, y);
    y += 8;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    if (formData.signatureBase64) {
      doc.setDrawColor(229, 231, 235);
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, y, contentWidth, 50, 3, 3, 'F');
      doc.roundedRect(margin, y, contentWidth, 50, 3, 3, 'S');
      doc.addImage(formData.signatureBase64, 'PNG', margin + 5, y + 5, contentWidth - 10, 40);
      y += 58;
    }

    y += 5;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const footerText = 'This document confirms compliance with the California Workplace Know Your Rights Act (SB 294). Employers are required to retain this record for a minimum of three (3) years. Powered by ElevaiteHR | elevaitehr.com';
    const footerLines = doc.splitTextToSize(footerText, contentWidth);
    doc.text(footerLines, margin, y);
    doc.save(`SB294-Compliance-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-8">

      {/* ── Employee Success Section ── */}
      <div className="text-center py-6 space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-110 animate-pulse"></div>
            <CheckCircle className="w-24 h-24 text-green-600 relative z-10 bg-white rounded-full" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">All Set!</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Your California Workplace - Know Your Rights Act acknowledgement has been securely recorded.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm max-w-sm mx-auto text-left space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Summary</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 font-medium">Signed & Verified</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Detention Contact:</span>
              <span>{formData.authorizeDetention ? 'Authorized' : 'Opted Out'}</span>
            </div>
            {formData.authorizeDetention && (
              <div className="flex justify-between">
                <span>Contact Name:</span>
                <span className="font-medium">{formData.contactName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <button
            onClick={handleDownload}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Download size={18} />
            Download PDF Confirmation
          </button>

          <div className="w-full border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Download Official California Notice</p>
            <div className="flex flex-wrap gap-2">
              {NOTICE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:text-orange-600'
                  }`}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
            <button
              onClick={() => downloadNotice(selectedLanguage)}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Download size={18} />
              Download ({languageLabel})
            </button>
          </div>
        </div>
      </div>

      {/* ── ElevaiteHR Pitch Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="border-t border-gray-100 pt-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5">
            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">HR</span>
            </div>
            <span className="text-sm font-medium text-orange-700">Powered by ElevaiteHR</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            This is what SB 294 compliance looks like — done right.
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            ElevaiteHR handles California's SB 294 notice requirements end-to-end, so you stay compliant without the paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900">Employee Wizard</div>
            <div className="text-xs text-gray-500">Guided 5-step flow in 10 languages. Works on any device.</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900">Secure Records</div>
            <div className="text-xs text-gray-500">Signatures, contact data, and audit trail stored securely.</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900">Gap Analysis</div>
            <div className="text-xs text-gray-500">See exactly which employees haven't completed compliance.</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center space-y-4">
          <div className="space-y-1">
            <div className="text-lg font-bold">Ready to protect your business?</div>
            <div className="text-orange-100 text-sm">
              Let's do a 15-minute call — we'll show you the admin dashboard and get you set up.
            </div>
          </div>
          <a
            href="https://calendly.com/elevaitehr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Book a 15-Minute Call
            <ArrowRight size={16} />
          </a>
          <div className="text-orange-200 text-xs">No pressure. No commitment.</div>
        </div>
      </motion.div>
    </div>
  );
};
