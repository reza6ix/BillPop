"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ClientForm({ onSave, initial }: { onSave: (c: any) => void; initial?: any }) {
  const [form, setForm] = useState(initial || { name: "", email: "" });
  return (
    <form
      className="space-y-2"
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
        setForm({ name: "", email: "" });
      }}
    >
      <input className="border rounded px-2 py-1 w-full" placeholder="Name/Business Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      <input className="border rounded px-2 py-1 w-full" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      <Button type="submit" className="bg-indigo-600 text-white mt-2">{initial ? "Update" : "Add"} Client</Button>
    </form>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(setClients);
  }, []);

  const fetchInvoices = (clientId: string) => {
    fetch(`/api/invoices?client_id=${clientId}`)
      .then(r => r.json())
      .then(setInvoices);
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Add New Client</h3>
          <ClientForm
            onSave={async (c) => {
              const res = await fetch("/api/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
              const newClient = await res.json();
              setClients(clients => [newClient, ...clients]);
            }}
          />
          <hr className="my-6" />
          <h3 className="font-semibold mb-2">Manage Clients</h3>
          <ul className="space-y-4">
            {clients.map(client => (
              <li key={client.id} className="border rounded-lg p-4 flex flex-col gap-2">
                {editing === client.id ? (
                  <ClientForm
                    initial={client}
                    onSave={async (c) => {
                      const res = await fetch("/api/clients", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...c, id: client.id }) });
                      const updated = await res.json();
                      setClients(clients => clients.map(cl => cl.id === client.id ? updated : cl));
                      setEditing(null);
                    }}
                  />
                ) : (
                  <>
                    <div><span className="font-semibold">Name:</span> {client.name}</div>
                    <div><span className="font-semibold">Email:</span> {client.email}</div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => { setSelected(client); fetchInvoices(client.id); }}>View Invoices</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(client.id)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={async () => {
                        await fetch("/api/clients", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: client.id }) });
                        setClients(clients => clients.filter(cl => cl.id !== client.id));
                      }}>Delete</Button>
                    </div>
                  </>
                )}
                {selected && selected.id === client.id && (
                  <div className="mt-4 bg-gray-50 rounded p-3">
                    <div className="font-semibold mb-2">Past Invoices</div>
                    {invoices.length === 0 ? <div className="text-muted-foreground">No invoices for this client.</div> : (
                      <ul className="space-y-1">
                        {invoices.map(inv => (
                          <li key={inv.id} className="text-sm">
                            #{inv.id?.substring(0, 8)} — {inv.date} — ${inv.total} — <span className="capitalize">{inv.status}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 