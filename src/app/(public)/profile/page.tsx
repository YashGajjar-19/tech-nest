"use client";

import { useAuth, openAuthModal } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Settings,
  Bookmark,
  GitCompare,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, ease: EASE, duration: 0.45 },
  }),
};

export default function ProfilePage() {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();

  // If not logged in, redirect to home and open auth modal
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      setTimeout(() => openAuthModal("login"), 300);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-text-primary/20 border-t-text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "User";
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const roleLabel =
    role === "super_admin"
      ? "Super Admin"
      : role === "admin"
      ? "Admin"
      : role === "editor"
      ? "Editor"
      : null;

  const statCards = [
    { icon: Bookmark, label: "Saved Devices", value: "—" },
    { icon: GitCompare, label: "Comparisons Made", value: "—" },
    { icon: Clock, label: "Member Since", value: memberSince },
  ];

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-6 pt-[20vh] pb-24">
      {/* ── Avatar + Name ── */}
      <motion.div
        variants={FADE_UP}
        custom={0}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10"
      >
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <div className="relative w-20 h-20 rounded-full border-2 border-border-subtle overflow-hidden">
               <Image
                 src={avatarUrl}
                 alt={fullName}
                 fill
                 className="object-cover"
               />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-text-primary/8 border border-border-subtle flex items-center justify-center text-2xl font-semibold text-text-primary">
              {initials}
            </div>
          )}
          {roleLabel && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-primary border border-border-subtle text-[10px] font-semibold text-text-secondary uppercase tracking-wide">
              <Shield className="h-2.5 w-2.5" />
              {roleLabel}
            </span>
          )}
        </div>

        {/* Name / Email */}
        <div className="text-center sm:text-left pt-0 sm:pt-2">
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
            {fullName}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={FADE_UP}
              custom={i + 1}
              initial="hidden"
              animate="show"
              className="rounded-2xl border border-border-subtle bg-surface p-5"
            >
              <Icon className="h-4 w-4 text-text-secondary mb-3" />
              <p className="text-xl font-semibold text-text-primary">
                {card.value}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Account Details ── */}
      <motion.div
        variants={FADE_UP}
        custom={4}
        initial="hidden"
        animate="show"
        className="rounded-2xl border border-border-subtle bg-surface overflow-hidden mb-5"
      >
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <User className="h-4 w-4 text-text-secondary" />
            Account
          </h2>
        </div>
        <div className="divide-y divide-border-subtle">
          <Row label="Full Name" value={fullName} />
          <Row label="Email Address" value={user.email ?? "—"} />
          <Row
            label="Sign-in Method"
            value={
              user.app_metadata?.provider === "google"
                ? "Google"
                : user.app_metadata?.provider === "apple"
                ? "Apple"
                : "Email & Password"
            }
          />
          <Row label="Account Role" value={roleLabel ?? "Member"} />
        </div>
      </motion.div>

      {/* ── Actions ── */}
      <motion.div
        variants={FADE_UP}
        custom={5}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl gap-2"
          disabled
        >
          <Settings className="h-4 w-4" />
          Edit Profile
          <span className="ml-auto text-[10px] text-text-secondary opacity-60 font-normal">
            Coming soon
          </span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl gap-2 text-red-500 hover:text-red-600 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5"
          onClick={async () => {
            await signOut();
            router.replace("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}
