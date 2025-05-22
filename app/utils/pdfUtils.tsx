'use client';

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { InvoiceData } from '../components/InvoiceForm';
import { InvoicePDFDocument } from '../components/InvoicePDF';

export async function generatePdfBlob(data: InvoiceData): Promise<Blob> {
  const pdfDoc = <InvoicePDFDocument data={data} />;
  const blob = await pdf(pdfDoc).toBlob();
  return blob;
}

export async function downloadPdf(data: InvoiceData): Promise<void> {
  try {
    const blob = await generatePdfBlob(data);
    
    const invoiceId = data.id.substring(0, 8);
    const filename = `invoice-${invoiceId}.pdf`;
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
} 