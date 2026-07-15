"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface FilterSelectProps {
  param: string;
  defaultValue?: string;
  children: React.ReactNode;
  label: string;
}

export function FilterSelect({
  param,
  defaultValue = "",
  children,
  label,
}: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = searchParams?.get(param) || defaultValue;

  function handleChange(newValue: string) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (newValue && newValue !== defaultValue) {
      params.set(param, newValue);
    } else {
      params.delete(param);
    }
    router.push(`/explore?${params.toString()}`);
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--input)] bg-white px-3 py-2 text-sm text-[var(--foreground)]"
      >
        {children}
      </select>
    </div>
  );
}
