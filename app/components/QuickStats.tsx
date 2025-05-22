import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock } from "lucide-react";

const stats = [
  { icon: <FileText className="h-8 w-8 text-indigo-500" />, label: "Total Invoices", value: 24 },
  { icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />, label: "Paid", value: 18 },
  { icon: <Clock className="h-8 w-8 text-sky-500" />, label: "Unpaid", value: 6 },
];

export default function QuickStats() {
  return (
    <Card className="h-full rounded-2xl shadow-md border-0 bg-white/90">
      <CardHeader>
        <CardTitle className="text-indigo-800">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-8 justify-center items-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {s.icon}
              <span className="text-3xl font-extrabold text-indigo-700">{s.value}</span>
              <span className="text-base text-muted-foreground font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 