"use client"
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function ExperimentPage() {

    const { theme, setTheme } = useTheme()

    const handleThemeToggle = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <>
        <div className="absolute top-6 right-6 flex items-center gap-3">
        <Button
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      className="fixed top-4 right-4 z-50"  // adjust position as needed
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
      </div>
      </>
    )
}