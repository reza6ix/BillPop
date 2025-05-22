import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus2, Settings2, BookOpen } from "lucide-react";

const actions = [
  { icon: <UserPlus2 className="h-6 w-6 text-indigo-500" />, label: "Add a new client", action: () => alert('Add client!') },
  { icon: <Settings2 className="h-6 w-6 text-sky-500" />, label: "Configure settings", action: () => alert('Configure settings!') },
  { icon: <BookOpen className="h-6 w-6 text-indigo-400" />, label: "View help docs", action: () => window.open('https://yourdocs.example.com', '_blank') },
];

export default function GetStarted() {
  return (
    <Card className="h-full rounded-2xl shadow-md border-0 bg-white/90">
      <CardHeader>
        <CardTitle className="text-indigo-800">Get Started</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {actions.map((a, i) => (
            <li key={i} className="flex items-center gap-4">
              {a.icon}
              <span className="flex-1 text-base font-semibold text-indigo-900">{a.label}</span>
              <Button size="sm" variant="outline" className="border-indigo-200 hover:bg-indigo-50" onClick={a.action}>
                Go
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 