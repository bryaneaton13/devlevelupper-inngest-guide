"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.body.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    setIsDark(document.body.classList.contains("dark"));
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDark}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
