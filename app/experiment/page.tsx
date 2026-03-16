"use client"
import { Switch } from "@/components/ui/switch";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ExperimentPage() {

    const { theme, setTheme } = useTheme()

    return (
        <div className="absolute top-6 right-6 flex items-center gap-3">
        <Sun
          className="h-5 w-5 transition-colors"
        />
        <Switch
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-300"
        />
        <Moon
          className="h-5 w-5 transition-colors"
        />
      </div>
    )
}