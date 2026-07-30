import { Activity, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg medical-gradient flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">MedBook</span>
        </Link>

        <Link
          to={isAdmin ? "/" : "/admin"}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ShieldCheck className="h-4 w-4" />
          {isAdmin ? "Patient Booking" : "Admin"}
        </Link>
      </div>
    </header>
  );
}
