'use client';

import { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { InvoiceData, InvoiceItem } from './InvoiceForm';
import { Button } from '@/components/ui/button';
import { downloadPdf } from '../utils/pdfUtils';
import { pdf } from '@react-pdf/renderer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

// Define styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#4B5563',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#1F2937',
  },
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 8,
    fontWeight: 500,
    color: '#374151',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
  },
  col1: { width: '40%' },
  col2: { width: '20%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#374151',
    paddingRight: 50,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1F2937',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

// PDF Document component
export function InvoicePDFDocument({ data }: { data: InvoiceData }) {
  const calculateTotal = (item: InvoiceItem) => {
    return item.quantity * item.rate;
  };

  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + calculateTotal(item), 0);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.subtitle}>Invoice #{data.id.substring(0, 8)}</Text>
        </View>

        {/* Client and Invoice Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Bill To</Text>
              <Text style={styles.value}>{data.clientName}</Text>
              <Text style={styles.value}>{data.clientEmail}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Invoice Details</Text>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Date Issued:</Text>
                  <Text style={styles.value}>{formatDate(data.date)}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.label}>Due Date:</Text>
                  <Text style={styles.value}>{formatDate(data.dueDate)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Invoice Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.col1]}>Description</Text>
              <Text style={[styles.tableCell, styles.col2]}>Quantity</Text>
              <Text style={[styles.tableCell, styles.col3]}>Rate</Text>
              <Text style={[styles.tableCell, styles.col4]}>Amount</Text>
            </View>
            
            {data.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.col3]}>${item.rate.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col4]}>${calculateTotal(item).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculateSubtotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Instructions</Text>
          <Text style={styles.value}>
            Please make payment by the due date to avoid late fees. Thank you for your business!
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Invoice Generator | {new Date().toLocaleString()}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default function InvoicePDF() {
  return null;
} 