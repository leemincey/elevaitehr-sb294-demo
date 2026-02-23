'use client';

import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

export const StepSuccess = ({ formData }: {
  formData: any;
  updateFormData: (updates: any) => void;
  onNext: () => void;
  onBack?: () => void;
}) => {

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Header background
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ElevaiteHR', margin, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Compliance Portal', margin, 23);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth - margin, 23, { align: 'right' });

    y = 50;

    // Title
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Compliance Acknowledgement', margin, y);
    y += 8;

    // Subtitle
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('California Workplace - Know Your Rights Act (SB 294)', margin, y);
    y += 15;

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // Status badge
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(margin, y - 6, 60, 10, 2, 2, 'F');
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SIGNED & VERIFIED', margin + 5, y + 1);
    y += 16;

    // Compliance details box
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

    // Emergency contact section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Emergency Contact Designation', margin, y);
    y += 8;

    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    if (formData.authorizeDetention) {
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F');
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'S');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
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

    // Signature section
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

    // Legal footer
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

    // Save
    doc.save(`SB294-Compliance-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-8 text-center py-8">
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

      <button
        onClick={handleDownload}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Download size={18} />
        Download PDF Confirmation
      </button>
    </div>
  );
};