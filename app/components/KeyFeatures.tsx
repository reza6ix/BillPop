import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Link2, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <FileText className="h-8 w-8 text-indigo-500" />, title: "PDF Generation", desc: "Download professional invoices as PDF instantly."
  },
  {
    icon: <Link2 className="h-8 w-8 text-sky-500" />, title: "Payment Links", desc: "Share secure payment links for online payments."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-emerald-500" />, title: "Invoice Tracking", desc: "Track sent, paid, and overdue invoices easily."
  },
];

export default function KeyFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 w-full max-w-4xl mx-auto">
      {features.map((f, i) => (
        <Card key={i} className="h-full rounded-2xl shadow-md border-0 bg-white/90">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            {f.icon}
            <CardTitle className="text-lg font-semibold text-indigo-800">{f.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-base">{f.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 