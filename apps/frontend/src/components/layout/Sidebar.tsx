"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Clock, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/history", label: "History", icon: Clock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 h-full border-r flex flex-col bg-background">
      {/* Logo */}
      <div className="h-14 px-4 flex items-center border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">D</span>
          </div>
          <span className="font-semibold">DocIntel</span>
        </Link>
      </div>

      {/* New Analysis Button */}
      <div className="p-3">
        <Link href="/documents/new">
          <Button className="w-full justify-start" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-secondary font-medium"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t">
        <div className="rounded-md bg-secondary/50 p-3">
          <p className="text-xs font-medium mb-1">Free Plan</p>
          <p className="text-xs text-muted-foreground mb-2">5 analyses remaining</p>
          <Button variant="outline" size="sm" className="w-full text-xs h-7">
            Upgrade
          </Button>
        </div>
      </div>
    </aside>
  );
}
