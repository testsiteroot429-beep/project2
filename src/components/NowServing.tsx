import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "now_serving_token";

export default function NowServing() {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : 1;
  });
  const [manualInput, setManualInput] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(token));
  }, [token]);

  function handleManualSet() {
    const num = parseInt(manualInput, 10);
    if (num > 0) {
      setToken(num);
      setManualInput("");
    }
  }

  return (
    <Card className="border-border shadow-md animate-fade-in-up overflow-hidden">
      <div className="medical-gradient px-5 py-3 flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-primary-foreground" />
        <span className="font-semibold text-primary-foreground text-sm">Currently Treating</span>
      </div>
      <CardContent className="py-5 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Now Serving</p>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setToken((t) => Math.max(1, t - 1))}
            className="h-10 w-10 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="token-badge text-4xl w-24 h-24">{token}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setToken((t) => t + 1)}
            className="h-10 w-10 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-2 w-full max-w-[200px]">
          <Input
            type="number"
            min={1}
            placeholder="Set token"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualSet()}
            className="h-9 text-center"
          />
          <Button size="sm" onClick={handleManualSet} className="medical-gradient text-primary-foreground h-9">
            Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
