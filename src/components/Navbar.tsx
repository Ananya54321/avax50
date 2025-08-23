"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Eye,
  ShoppingCart,
  DollarSign,
  Briefcase,
  TrendingUp,
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      section: "main",
    },
    {
      name: "Assets",
      href: "/assets",
      icon: Eye,
      section: "main",
    },
    {
      name: "Buy",
      href: "/buy",
      icon: ShoppingCart,
      section: "trading",
    },
    {
      name: "Sell",
      href: "/sell",
      icon: DollarSign,
      section: "trading",
    },
    {
      name: "Portfolio",
      href: "/portfolio",
      icon: Briefcase,
      section: "trading",
    },
  ];

  const mainItems = navigationItems.filter((item) => item.section === "main");
  const tradingItems = navigationItems.filter(
    (item) => item.section === "trading"
  );

  return (
    <div className="h-full flex flex-col bg-black text-white overflow-hidden border-r border-gray-800">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 mt-4">
        {/* Main Section */}
        <div className=" pb-8 border-b border-gray-700">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Overview
          </h3>
          <div className="space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center sidebarfont px-3 py-2 text-lg font-semibold rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-red-800 text-white border-l-4 border-red-400"
                      : "hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 transition-colors ${
                      isActive
                        ? "text-red-300"
                        : "text-gray-400 group-hover:text-red-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trading Section */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Trading
          </h3>
          <div className="space-y-1">
            {tradingItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center sidebarfont px-3 py-2 text-lg font-semibold rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-red-800 text-white border-l-4 border-red-400"
                      : "hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 transition-colors ${
                      isActive
                        ? "text-red-300"
                        : "text-gray-400 group-hover:text-red-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">v1.0.0</div>
      </div>
    </div>
  );
};

export default Navbar;
