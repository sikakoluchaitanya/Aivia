"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react"; // icon library
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import SignInButton from "./SignInButton";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/quizzes", label: "Quizzes" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border/40 bg-background/70 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent transition hover:opacity-80"
        >
          Aivia
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <SignInButton text="Sign In" />
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-foreground md:hidden"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="border-t border-border/40 bg-background/95 shadow-md md:hidden">
          <div className="flex flex-col space-y-2 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-1 text-sm font-medium text-foreground/80 transition hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
