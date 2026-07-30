import { format, parse } from "date-fns";
import { CalendarDays, Check, Clock, MapPin, Phone, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Appointment } from "@/lib/appointments";

interface Props {
  appointment: Appointment;
  onNewBooking: () => void;
}

export default function BookingConfirmation({ appointment, onNewBooking }: Props) {
  const dateLabel = format(parse(appointment.date, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy");

  const rows = [
    { icon: User, label: "Patient Name", value: appointment.patientName },
    { icon: Phone, label: "Mobile Number", value: appointment.mobileNumber },
    { icon: MapPin, label: "Place", value: appointment.place },
    { icon: CalendarDays, label: "Appointment Date", value: dateLabel },
    { icon: Clock, label: "Time Slot", value: appointment.timeSlot },
    { icon: Tag, label: "Appointment ID", value: appointment.id },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Success banner */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-16 w-16 rounded-full medical-gradient flex items-center justify-center shadow-lg shadow-primary/25 animate-scale-in">
          <Check className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Appointment Booked!</h2>
          <p className="text-muted-foreground mt-1">Your appointment has been confirmed successfully.</p>
        </div>
      </div>

      {/* Token */}
      <div className="flex flex-col items-center py-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Token Number</span>
        <span className="token-badge text-3xl w-20 h-20">{appointment.serialNumber}</span>
      </div>

      {/* Details */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0 divide-y divide-border">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="flex items-center gap-3 px-5 py-3.5 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <r.icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground w-36 shrink-0">{r.label}</span>
              <span className="text-sm font-medium text-foreground">{r.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={onNewBooking}
        variant="outline"
        size="lg"
        className="w-full h-12 font-semibold active:scale-[0.98] transition-all duration-200"
      >
        Book Another Appointment
      </Button>
    </div>
  );
}
