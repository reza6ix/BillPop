import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus2, ListChecks } from "lucide-react";

export default function DashboardHero({ onCreate, onManage }: { onCreate: () => void; onManage: () => void }) {
  return (
    <Card className="mb-8 p-0 overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-indigo-500/10 via-sky-100/60 to-white rounded-2xl">
      <div className="flex flex-col items-center justify-center py-10 px-4 md:px-16 text-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 w-14 h-14 flex items-center justify-center text-white font-bold text-3xl shadow-md select-none">B</div>
          <span className="text-3xl font-extrabold tracking-tight text-indigo-700">BillPop</span>
        </div>
        <CardTitle className="text-2xl md:text-4xl font-bold mb-2">Effortless Invoicing for Modern Businesses</CardTitle>
        <p className="text-muted-foreground text-lg mb-6 max-w-xl mx-auto">
          Create, manage, and track invoices with ease. Generate PDFs, payment links, and more—all in one beautiful dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <Button size="lg" className="flex-1 text-lg gap-2 bg-gradient-to-r from-indigo-500 to-sky-400 text-white shadow-lg border-0 hover:from-indigo-600 hover:to-sky-500">
            <FilePlus2 className="h-5 w-5" />
            <span onClick={onCreate}>Create New Invoice</span>
          </Button>
          <Button size="lg" variant="outline" className="flex-1 text-lg gap-2 border-indigo-200 hover:bg-indigo-50" onClick={onManage}>
            <ListChecks className="h-5 w-5 text-indigo-600" />
            Manage Invoices
          </Button>
        </div>
      </div>
    </Card>
  );
} 