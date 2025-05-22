import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle2, Clock } from "lucide-react";

const activity = [
  { icon: <FileText className="h-5 w-5 text-indigo-500" />, desc: "Created invoice #INV-0012", time: "2 min ago" },
  { icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, desc: "Invoice #INV-0011 marked as paid", time: "1 hour ago" },
  { icon: <Clock className="h-5 w-5 text-sky-500" />, desc: "Invoice #INV-0010 is overdue", time: "Yesterday" },
];

export default function RecentActivity() {
  return (
    <Card className="h-full rounded-2xl shadow-md border-0 bg-white/90">
      <CardHeader>
        <CardTitle className="text-indigo-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((a, i) => (
              <TableRow key={i}>
                <TableCell>{a.icon}</TableCell>
                <TableCell className="font-semibold text-indigo-900 text-base">{a.desc}</TableCell>
                <TableCell className="text-right text-muted-foreground text-sm">{a.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 