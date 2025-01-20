"use client";

import { Button } from "@/components/ui/button";
import { Users, Radio } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavLinks({ id }: { id: string }) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "People",
      href: `/org/${id}/people`,
      icon: Users,
    },
    {
      name: "Broadcasts",
      href: `/org/${id}/broadcasts`,
      icon: Radio,
    },
  ];

  return (
    <nav className="flex gap-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.name}
            variant={isActive ? "default" : "ghost"}
            asChild
          >
            <Link href={item.href} className={cn("gap-2")}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
