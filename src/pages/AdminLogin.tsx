import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const ADMIN_USER = "admin";
const ADMIN_PASS = "hospital123";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm border-border shadow-lg animate-fade-in-up">
        <CardContent className="pt-8 pb-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full medical-gradient flex items-center justify-center shadow-md">
              <ShieldCheck className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Admin Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Password</Label>
              <Input id="pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="h-11" />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full h-11 medical-gradient text-primary-foreground font-semibold active:scale-[0.98] transition-all">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">Demo: admin / hospital123</p>
        </CardContent>
      </Card>
    </div>
  );
}
