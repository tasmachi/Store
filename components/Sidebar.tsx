"use client";

import { avatarPlaceholderUrl, navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="h-auto lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ name, icon, url }) => {
            const isActive = pathname === url;

            return (
              <Link href={url} key={url} className="lg:w-full">
                <li
                  className={cn("sidebar-nav-item", isActive && "shad-active")}
                >
                  <Image
                    className={cn("nav-icon", isActive && "nav-icon-active")}
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                  />
                  <p className="hidden lg:inline">{name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        alt="files"
        width={506}
        height={418}
        className="w-full hidden lg:block"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatar || avatarPlaceholderUrl}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
