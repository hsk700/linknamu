"use client";

import { useEffect, useState } from "react";

type Link = { label: string; href: string };

export default function LinkList({ links }: { links: Link[] }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/clicks", { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("클릭 수 조회 실패");
        const data: { counts: Record<string, number> } = await res.json();
        setCounts((prev) => {
          const next = { ...prev };
          for (const [href, count] of Object.entries(data.counts)) {
            next[href] = Math.max(prev[href] ?? 0, count);
          }
          return next;
        });
      })
      .catch(() => { /* 조회 실패 시 기본값 유지 */ });
    return () => controller.abort();
  }, []);

  const handleClick = async (href: string) => {
    try {
      const res = await fetch("/api/clicks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ href }),
        keepalive: true,
      });
      if (!res.ok) throw new Error("클릭 수 저장 실패");
      const data: { count: number } = await res.json();
      setCounts((prev) => ({ ...prev, [href]: Math.max(prev[href] ?? 0, data.count) }));
    } catch { /* 집계 실패와 관계없이 링크 이동 */ }
  };

  return (
    <ul className="flex w-full flex-col gap-4">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void handleClick(link.href)}
            onAuxClick={(event) => {
              if (event.button === 1) void handleClick(link.href);
            }}
            className="grid min-h-20 w-full grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border-2 border-stone-800 bg-white px-6 py-5 text-base font-semibold transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-800"
          >
            <span className="col-start-2">{link.label}</span>
            <span className="justify-self-end text-xs font-normal text-stone-500">
              {counts[link.href] ?? 0}회
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
