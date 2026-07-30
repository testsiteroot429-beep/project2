import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "now_serving_token";

export default function NowServingPublic() {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : 1;
  });

  useEffect(() => {
    // Poll localStorage every 2s for admin updates
    const interval = setInterval(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setToken(Number(saved));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-border shadow-md overflow-hidden animate-fade-in-up">
      <CardContent className="py-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full medical-gradient flex items-center justify-center shadow-lg shadow-primary/20">
          <Stethoscope className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Now Serving</p>
          <p className="text-3xl font-bold text-foreground tabular-nums" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Token #{token}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
