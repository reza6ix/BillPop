import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const statusColor = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Unpaid: 'bg-sky-100 text-sky-700',
  Overdue: 'bg-rose-100 text-rose-700',
  Draft: 'bg-gray-100 text-gray-700',
};

export default function InvoicesTable({ invoices = [] }: { invoices?: any[] }) {
  return (
    <Card className="mt-8 rounded-2xl shadow-md border-0 bg-white/90">
      <CardHeader>
        <CardTitle className="text-indigo-800">Manage Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-indigo-700">Invoice #</TableHead>
              <TableHead className="text-indigo-700">Client</TableHead>
              <TableHead className="text-indigo-700">Amount</TableHead>
              <TableHead className="text-indigo-700">Status</TableHead>
              <TableHead className="text-indigo-700">Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No invoices yet.</TableCell>
              </TableRow>
            ) : (
              invoices.map((inv, i) => (
                <TableRow key={inv.id || i}>
                  <TableCell className="font-bold text-indigo-900 text-base">{inv.id?.substring ? inv.id.substring(0, 8) : inv.id || '—'}</TableCell>
                  <TableCell className="font-semibold text-indigo-800">{inv.clientName || inv.client?.name || inv.client || '—'}<br /><span className="text-xs text-muted-foreground">{inv.clientEmail || inv.client?.email || ''}</span></TableCell>
                  <TableCell className="text-base">${inv.items ? inv.items.reduce((sum: number, item: any) => sum + item.quantity * item.rate, 0).toFixed(2) : inv.amount || '—'}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[inv.status as keyof typeof statusColor] || statusColor.Draft}`}>{inv.status || 'Draft'}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.date || inv.created_at || '—'}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="border-indigo-200 hover:bg-indigo-50">View</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 