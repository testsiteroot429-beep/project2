import { useState } from "react";
import { format, parse } from "date-fns";
import { CalendarDays, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  getToday,
  getTomorrow,
  isDuplicateBooking,
  bookAppointment,
  type Appointment,
} from "@/lib/appointments";
import BookingConfirmation from "./BookingConfirmation";

export default function BookingForm() {
  const today = getToday();
  const tomorrow = getTomorrow();

  const [selectedDate, setSelectedDate] = useState(today);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [place, setPlace] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<Appointment | null>(null);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Patient name is required";
    if (!/^\d{10}$/.test(mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!place.trim()) e.place = "Location is required";
    
    // Updated duplicate check: checks if this mobile already has a booking for the chosen date
    if (isDuplicateBooking(mobile, "Anytime", selectedDate))
      e.mobile = "This mobile number already has a booking for this date";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    
    // Passing "Anytime" as a default slot value to maintain compatibility with your library
    const appt = bookAppointment(name.trim(), mobile, place.trim(), selectedDate, "Anytime");
    setConfirmation(appt);
  }

  function reset() {
    setConfirmation(null);
    setName("");
    setMobile("");
    setPlace("");
    setSelectedDate(today);
  }

  if (confirmation) {
    return <BookingConfirmation appointment={confirmation} onNewBooking={reset} />;
  }

  const formatDateLabel = (d: string) => {
    const parsed = parse(d, "yyyy-MM-dd", new Date());
    return format(parsed, "EEEE, MMMM d, yyyy");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
      {/* Date selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> Select Date
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: today, label: "Today", sub: formatDateLabel(today) },
            { value: tomorrow, label: "Tomorrow", sub: formatDateLabel(tomorrow) },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedDate(opt.value)}
              className={`relative p-4 rounded-lg border-2 text-left transition-all duration-200 active:scale-[0.97] ${
                selectedDate === opt.value
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              <span className="font-semibold text-foreground">{opt.label}</span>
              <span className="block text-xs text-muted-foreground mt-1">{opt.sub}</span>
              {selectedDate === opt.value && (
                <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary animate-scale-in" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Patient info */}
      <Card className="border-border shadow-sm">
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" /> Patient Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: "" })); }}
              placeholder="Enter patient name"
              className="h-11"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-muted-foreground" /> Mobile Number
            </Label>
            <Input
              id="mobile"
              value={mobile}
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors((er) => ({ ...er, mobile: "" })); }}
              placeholder="10-digit mobile number"
              className="h-11"
              inputMode="numeric"
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="place" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Place / Location
            </Label>
            <Input
              id="place"
              value={place}
              onChange={(e) => { setPlace(e.target.value); setErrors((er) => ({ ...er, place: "" })); }}
              placeholder="City or area"
              className="h-11"
            />
            {errors.place && <p className="text-sm text-destructive">{errors.place}</p>}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full h-12 medical-gradient text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98]">
        Book Appointment
      </Button>
    </form>
  );
}