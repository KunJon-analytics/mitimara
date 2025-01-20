"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trees, CheckSquare, User } from "lucide-react";

const navItems = [
  { href: "/app", Icon: Home, label: "Home" },
  { href: "/app/plant-tree", Icon: Trees, label: "Plant" },
  { href: "/app/verify-tree", Icon: CheckSquare, label: "Verify" },
  { href: "/app/my-trees", Icon: User, label: "My Trees" },
];

const DashboardFooter = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t border-card-foreground">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
              pathname === item.href ? "text-primary" : ""
            }`}
          >
            <item.Icon className="w-6 h-6 mb-1 transition-colors duration-150 ease-in-out" />
            <span className="text-xs transition-colors duration-150 ease-in-out">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default DashboardFooter;
