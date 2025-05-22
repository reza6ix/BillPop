'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, X } from "lucide-react";

// Define types for our invoice data
export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type InvoiceData = {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
};

export default function InvoiceForm({
  onGenerate
}: {
  onGenerate: (data: InvoiceData) => void;
}) {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [newClient, setNewClient] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [addingClient, setAddingClient] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: uuidv4(), description: '', quantity: 1, rate: 0 }
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  // Editable date fields
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0];
  const defaultDueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [date, setDate] = useState(defaultDate);
  const [dueDate, setDueDate] = useState(defaultDueDate);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setClients(data);
          
          // If no clients exist, create a default one
          if (data.length === 0) {
            const defaultClient = { 
              name: "Default Client", 
              email: "default@example.com" 
            };
            
            fetch('/api/clients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(defaultClient),
            })
            .then(res => res.json())
            .then(newClient => {
              setClients([newClient]);
              setSelectedClientId(newClient.id);
            })
            .catch(err => {
              console.error("Failed to create default client:", err);
              setFormError("Failed to create a default client. Please try again or add a client manually.");
            });
          } else if (data.length > 0 && !selectedClientId) {
            // Auto-select the first client if none is selected
            setSelectedClientId(data[0].id);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching clients:", err);
        setFormError("Failed to load clients. Please refresh the page.");
      });
  }, []);

  const handleAddClient = async () => {
    if (!newClient.name) return;
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    });
    if (res.ok) {
      const client = await res.json();
      setClients([client, ...clients]);
      setSelectedClientId(client.id);
      setAddingClient(false);
      setNewClient({ name: '', email: '' });
    }
  };

  const addItem = () => {
    setItems([...items, { id: uuidv4(), description: '', quantity: 1, rate: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateTotal = (item: InvoiceItem) => {
    return item.quantity * item.rate;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateTotal(item), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let clientIdToUse = selectedClientId;

    // If no client selected and not adding a new one, create a random client
    if (!selectedClientId && !addingClient) {
      // Create a random client
      const randomName = "Random Client " + uuidv4().slice(0, 8);
      const randomEmail = "random-" + uuidv4().slice(0, 8) + "@example.com";
      try {
        const res = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: randomName, email: randomEmail }),
        });
        if (!res.ok) {
          setFormError('Failed to create random client. Please select an existing client.');
          return;
        }
        const client = await res.json();
        setClients([client, ...clients]);
        clientIdToUse = client.id;
      } catch (err) {
        console.error("Error creating random client:", err);
        setFormError('Failed to create random client. Please select an existing client.');
        return;
      }
    }

    // If we still don't have a valid client ID, don't proceed
    if (!clientIdToUse || !clients.some(c => c.id === clientIdToUse)) {
      setFormError('Please select a valid client before generating an invoice.');
      return;
    }

    const client = clients.find(c => c.id === clientIdToUse);
    const invoiceData: InvoiceData = {
      id: uuidv4(),
      clientId: clientIdToUse,
      clientName: client?.name || clientName,
      clientEmail: client?.email || clientEmail,
      date,
      dueDate,
      items
    };
    onGenerate(invoiceData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="text-red-600 font-medium mb-2">{formError}</div>
          )}
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientSelect">Select Client</Label>
                <select
                  id="clientSelect"
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="w-full border rounded px-2 py-2"
                  required={!addingClient}
                >
                  <option value="">-- Select client --</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setAddingClient(v => !v)}>
                    {addingClient ? 'Cancel' : 'Add New Client'}
                  </Button>
                  {clients.length === 0 && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="default"
                      onClick={async () => {
                        const defaultClient = { 
                          name: "Default Client", 
                          email: "default@example.com" 
                        };
                        
                        try {
                          const res = await fetch('/api/clients', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(defaultClient),
                          });
                          if (!res.ok) {
                            setFormError("Failed to create default client");
                            return;
                          }
                          const newClient = await res.json();
                          setClients([newClient]);
                          setSelectedClientId(newClient.id);
                          setFormError(null);
                        } catch (err) {
                          console.error("Failed to create default client:", err);
                          setFormError("Failed to create default client");
                        }
                      }}
                    >
                      Create Default Client
                    </Button>
                  )}
                </div>
              </div>
              {addingClient && (
                <div className="space-y-2">
                  <Label htmlFor="newClientName">New Client Name</Label>
                  <Input
                    id="newClientName"
                    value={newClient.name}
                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="Enter client name"
                    required
                  />
                  <Label htmlFor="newClientEmail">New Client Email</Label>
                  <Input
                    id="newClientEmail"
                    type="email"
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="Enter client email"
                    required
                  />
                  <Button type="button" size="sm" className="mt-2" onClick={handleAddClient}>Save Client</Button>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Date Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addItem}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Item</span>
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input 
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                          className="border-none shadow-none focus-visible:ring-0"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="border-none shadow-none focus-visible:ring-0 w-20"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="border-none shadow-none focus-visible:ring-0 w-28"
                          required
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${calculateTotal(item).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length <= 1}
                          className="h-8 w-8 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-lg font-medium">${calculateSubtotal().toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="px-6 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors border-0"
            >
              Generate Invoice
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 