'use client';

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import DashboardHero from "./components/DashboardHero";
import KeyFeatures from "./components/KeyFeatures";
import QuickStats from "./components/QuickStats";
import RecentActivity from "./components/RecentActivity";
import GetStarted from "./components/GetStarted";
import InvoicesTable from "./components/InvoicesTable";
import InvoiceForm, { InvoiceData } from "./components/InvoiceForm";
import { downloadPdf } from "./utils/pdfUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InvoicePDF = dynamic(() => import("./components/InvoicePDF"), {
  ssr: false,
});

function Notification({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
      {message}
      <button className="ml-4 text-white/80 hover:text-white" onClick={onClose}>×</button>
    </div>
  );
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [notification, setNotification] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  const handleCreate = () => {
    setShowForm(true);
    setShowManage(false);
  };
  const handleManage = () => {
    setShowManage(true);
    setShowForm(false);
  };
  const handleBack = () => {
    setShowForm(false);
    setShowManage(false);
    setInvoiceData(null);
  };
  const handleGenerateInvoice = async (data: InvoiceData) => {
    setInvoiceData(data);
    try {
      if (!data.clientId) {
        console.error("Missing client ID");
        throw new Error('Missing client ID');
      }
      
      console.log({
        client_id: data.clientId,
        date: data.date,
        due_date: data.dueDate,
        status: 'Draft',
        total: data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0),
        items: data.items,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
      });
      
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: data.clientId,
          date: data.date,
          due_date: data.dueDate,
          status: 'Draft',
          total: data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0),
          items: data.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate
          })),
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to save invoice: ${errorData.error || res.statusText}`);
      }
      
      const saved = await res.json();
      setNotification('Invoice generated and saved!');
      setInvoices((prev) => [
        { ...data, status: 'Draft', created_at: new Date().toISOString(), ...saved },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error saving invoice:", err);
      setNotification('Invoice generated (local only): ' + (err as Error).message);
      setInvoices((prev) => [
        { ...data, status: 'Draft', created_at: new Date().toISOString() },
        ...prev,
      ]);
    }
    setTimeout(() => setNotification(''), 2500);
  };
  const handleDownloadPdf = async () => {
    if (invoiceData) await downloadPdf(invoiceData);
  };
  const handlePrint = () => {
    if (!invoicePreviewRef.current) return;
    const printContents = invoicePreviewRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Invoice</title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (showForm) {
    return (
      <div className="container py-10 max-w-3xl mx-auto">
        <Notification message={notification} onClose={() => setNotification("")} />
        <button onClick={handleBack} className="mb-4 text-sm text-muted-foreground hover:underline">← Back to Dashboard</button>
        <InvoiceForm onGenerate={handleGenerateInvoice} />
        {invoiceData && (
          <Card className="mt-8 p-6">
            <div className="mb-4 font-semibold text-lg">Invoice Preview</div>
            <div ref={invoicePreviewRef} className="space-y-2">
              <div><span className="font-semibold">Client:</span> {invoiceData.clientName} ({invoiceData.clientEmail})</div>
              <div><span className="font-semibold">Invoice Date:</span> {invoiceData.date}</div>
              <div><span className="font-semibold">Due Date:</span> {invoiceData.dueDate}</div>
              <div className="mt-4">
                <span className="font-semibold">Items:</span>
                <ul className="list-disc ml-6 mt-1">
                  {invoiceData.items.map((item, idx) => (
                    <li key={item.id || idx}>
                      {item.description} — Qty: {item.quantity}, Rate: ${item.rate.toFixed(2)}, Amount: ${(item.quantity * item.rate).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 text-lg font-bold">Total: ${invoiceData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0).toFixed(2)}</div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={handleDownloadPdf} variant="outline">Download PDF</Button>
              <Button onClick={handlePrint} variant="outline">Print</Button>
            </div>
          </Card>
        )}
      </div>
    );
  }
  if (showManage) {
    return (
      <div className="container py-10 max-w-5xl mx-auto">
        <Notification message={notification} onClose={() => setNotification("")} />
        <button onClick={handleBack} className="mb-4 text-sm text-muted-foreground hover:underline">← Back to Dashboard</button>
        <InvoicesTable invoices={invoices} />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Notification message={notification} onClose={() => setNotification("")} />
      <div className="container py-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-4xl mx-auto">
            <DashboardHero onCreate={handleCreate} onManage={handleManage} />
            <KeyFeatures />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 w-full max-w-6xl mx-auto items-start">
            <div className="md:col-span-2 flex flex-col gap-6">
              <QuickStats />
              <RecentActivity />
            </div>
            <div>
              <GetStarted />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
