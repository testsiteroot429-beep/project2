import { format } from "date-fns";

export interface Appointment {
  id: string;
  serialNumber: number;
  patientName: string;
  mobileNumber: string;
  place: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: "booked" | "completed";
  createdAt: string;
}

const STORAGE_KEY = "hospital_appointments";

export function getAppointments(): Appointment[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveAppointments(appointments: Appointment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return format(d, "yyyy-MM-dd");
}

export function isValidBookingDate(dateStr: string): boolean {
  return dateStr === getToday() || dateStr === getTomorrow();
}

export function generateAppointmentId(dateStr: string, serial: number): string {
  const datePart = dateStr.replace(/-/g, "");
  return `HOSP-${datePart}-${String(serial).padStart(4, "0")}`;
}

export function getNextSerialNumber(dateStr: string): number {
  const appointments = getAppointments().filter((a) => a.date === dateStr);
  if (appointments.length === 0) return 1;
  return Math.max(...appointments.map((a) => a.serialNumber)) + 1;
}

export function isDuplicateBooking(mobileNumber: string, _timeSlot: string, date: string): boolean {
  return getAppointments().some(
    (a) => a.mobileNumber === mobileNumber && a.date === date
  );
}

export function bookAppointment(
  patientName: string,
  mobileNumber: string,
  place: string,
  date: string,
  timeSlot: string
): Appointment {
  const serialNumber = getNextSerialNumber(date);
  const appointment: Appointment = {
    id: generateAppointmentId(date, serialNumber),
    serialNumber,
    patientName,
    mobileNumber,
    place,
    date,
    timeSlot,
    status: "booked",
    createdAt: new Date().toISOString(),
  };
  const all = getAppointments();
  all.push(appointment);
  saveAppointments(all);
  return appointment;
}

export function deleteAppointment(id: string): void {
  saveAppointments(getAppointments().filter((a) => a.id !== id));
}

export function markCompleted(id: string): void {
  const all = getAppointments();
  const idx = all.findIndex((a) => a.id === id);
  if (idx !== -1) {
    all[idx].status = "completed";
    saveAppointments(all);
  }
}

export function getCountForDate(dateStr: string): number {
  return getAppointments().filter((a) => a.date === dateStr).length;
}

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

export function getAvailableSlots(dateStr: string): string[] {
  const booked = getAppointments()
    .filter((a) => a.date === dateStr)
    .map((a) => a.timeSlot);
  return TIME_SLOTS.filter((s) => !booked.includes(s));
}
