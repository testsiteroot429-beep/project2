import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { CalendarDays, CheckCircle2, LogOut, Search, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import NowServing from "@/components/NowServing";
import AppointmentHistory from "@/components/AppointmentHistory";
import {
  getAppointments,
  getToday,
  getTomorrow,
  getCountForDate,
  deleteAppointment,
  markCompleted,
  type Appointment,
} from "@/lib/appointments";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<"all" | "today" | "tomorrow">("all");
  const [search, setSearch] = useState("");
  const today = getToday();
  const tomorrow = getTomorrow();

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") {
      navigate("/admin");
      return;
    }
    reload();
  }, [navigate]);

  function reload() {
    setAppointments(getAppointments());
  }

  function handleDelete(id: string) {
    deleteAppointment(id);
    reload();
  }

  function handleComplete(id: string) {
    markCompleted(id);
    reload();
  }

  function logout() {
    sessionStorage.removeItem("admin_auth");
    navigate("/admin");
  }

  // Active appointments = today + tomorrow only
  const active = appointments.filter((a) => a.date === today || a.date === tomorrow);

  const filtered = active
    .filter((a) => {
      if (filter === "today") return a.date === today;
      if (filter === "tomorrow") return a.date === tomorrow;
      return true;
    })
    .filter((a) => {
      if (!search.trim()) return true;
      const s = search.toLowerCase();
      return (
        a.mobileNumber.includes(s) ||
        a.date.includes(s) ||
        a.patientName.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const todayCount = getCountForDate(today);
  const tomorrowCount = getCountForDate(tomorrow);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="medical-gradient py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-foreground">Admin Dashboard</h1>
          <Button variant="ghost" onClick={logout} className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4 space-y-6 pb-12">
        {/* Insight cards + Now Serving */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
          <Card className="card-hover border-border shadow-md">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Patients</p>
                <p className="text-3xl font-bold text-foreground tabular-nums">{todayCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover border-border shadow-md">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tomorrow's Patients</p>
                <p className="text-3xl font-bold text-foreground tabular-nums">{tomorrowCount}</p>
              </div>
            </CardContent>
          </Card>
          <NowServing />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex gap-2">
            {(["all", "today", "tomorrow"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f ? "medical-gradient text-primary-foreground" : ""}
              >
                {f === "all" ? "All" : f === "today" ? "Today" : "Tomorrow"}
              </Button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, mobile, or date…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Active Appointments Table */}
        <Card className="border-border shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Token</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Appt. ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Mobile</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Place</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-muted-foreground">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, i) => (
                    <tr
                      key={a.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="py-3 px-4">
                        <span className="token-badge text-sm w-9 h-9 min-w-0 min-h-0">{a.serialNumber}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{a.id}</td>
                      <td className="py-3 px-4 font-medium text-foreground">{a.patientName}</td>
                      <td className="py-3 px-4 tabular-nums">{a.mobileNumber}</td>
                      <td className="py-3 px-4">{a.place}</td>
                      <td className="py-3 px-4 tabular-nums">
                        {format(parse(a.date, "yyyy-MM-dd", new Date()), "dd MMM yyyy")}
                      </td>
                      <td className="py-3 px-4">{a.timeSlot}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                            a.status === "completed"
                              ? "bg-success/10 text-success"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {a.status === "completed" ? "Completed" : "Booked"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          {a.status !== "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleComplete(a.id)}
                              className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
                              title="Mark completed"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(a.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* History Section */}
        <AppointmentHistory appointments={appointments} today={today} tomorrow={tomorrow} />
      </div>
    </div>
  );
}
