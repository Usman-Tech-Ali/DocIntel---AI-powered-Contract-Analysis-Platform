"use client";

import { Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

export function Header({ title, showSearch = true }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b px-6 flex items-center justify-between bg-background">
      <h1 className="text-sm font-medium">{title}</h1>
      <div className="flex items-center gap-2">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-48 h-8 text-sm"
            />
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
          U
        </div>
      </div>
    </header>
  );
}
