"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Shield, History, Scale } from "lucide-react";

const stats = [
  {
    icon: Layers,
    value: 12,
    suffix: "+",
    label: "Categorias de Bens",
  },
  {
    icon: Shield,
    value: 7,
    suffix: "",
    label: "Perfis de Acesso",
  },
  {
    icon: History,
    value: 100,
    suffix: "%",
    label: "Rastreabilidade",
  },
  {
    icon: Scale,
    value: 13019,
    suffix: "",
    label: "Lei em Conformidade",
    prefix: "Lei ",
  },
];

function CountUp({
  target,
  prefix,
  suffix,
}: {
  target: number;
  prefix?: string;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display =
    target === 13019
      ? hasAnimated.current && count === target
        ? "13.019"
        : count.toLocaleString("pt-BR")
      : count.toString();

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-verde-escuro via-verde-medio to-verde-escuro relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="stats-dots"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-dots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-8 w-8 text-verde-claro mb-4" />
              <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                <CountUp
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
