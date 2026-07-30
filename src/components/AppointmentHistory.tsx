import { useMemo } from "react";
import { format, parse } from "date-fns";
import { FolderOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Appointment } from "@/lib/appointments";

interface Props {
  appointments: Appointment[];
  today: string;
  tomorrow: string;
}

export default function AppointmentHistory({ appointments, today, tomorrow }: Props) {
  const grouped = useMemo(() => {
    const past = appointments.filter((a) => a.date !== today && a.date !== tomorrow);
    const map = new Map<string, Appointment[]>();
    past.forEach((a) => {
      const list = map.get(a.date) || [];
      list.push(a);
      map.set(a.date, list);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        label: format(parse(date, "yyyy-MM-dd", new Date()), "dd MMM yyyy"),
        items: items.sort((a, b) => a.serialNumber - b.serialNumber),
      }));
  }, [appointments, today, tomorrow]);

  if (grouped.length === 0) return null;

  return (
    <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <FolderOpen className="h-5 w-5 text-primary" />
        Appointment History
      </h2>
      <Card className="border-border shadow-sm overflow-hidden">
        <Accordion type="multiple">
          {grouped.map(({ date, label, items }) => (
            <AccordionItem key={date} value={date}>
              <AccordionTrigger className="px-5 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">📁 {label}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {items.length} appointment{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-2.5 px-5 font-medium text-muted-foreground text-xs">Token</th>
                        <th className="text-left py-2.5 px-5 font-medium text-muted-foreground text-xs">Appt. ID</th>
                        <th className="text-left py-2.5 px-5 font-medium text-muted-foreground text-xs">Patient</th>
                        <th className="text-left py-2.5 px-5 font-medium text-muted-foreground text-xs">Mobile</th>
                        <th className="text-left py-2.5 px-5 font-medium text-muted-foreground text-xs">Place</th>
                        <th className="text-left py-2.5 px-5 font-medium text-muted-foreground text-xs">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((a) => (
                        <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-5">
                            <span className="token-badge text-xs w-7 h-7 min-w-0 min-h-0">{a.serialNumber}</span>
                          </td>
                          <td className="py-2.5 px-5 font-mono text-xs text-muted-foreground">{a.id}</td>
                          <td className="py-2.5 px-5 font-medium text-foreground">{a.patientName}</td>
                          <td className="py-2.5 px-5 tabular-nums">{a.mobileNumber}</td>
                          <td className="py-2.5 px-5">{a.place}</td>
                          <td className="py-2.5 px-5">{a.timeSlot}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
