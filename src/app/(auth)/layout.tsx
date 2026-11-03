import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-[radial-gradient(circle_at_top,oklch(0.95_0.02_160),transparent_45%),linear-gradient(180deg,var(--background),oklch(0.97_0.01_160))] dark:bg-[radial-gradient(circle_at_top,oklch(0.28_0.03_160),transparent_40%),linear-gradient(180deg,var(--background),oklch(0.16_0.01_160))]">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Funlife
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
