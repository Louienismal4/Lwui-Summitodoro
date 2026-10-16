const drawings = {
  mountain: <>
    <path d="m8 101 33-65 23 34 17-28 31 59Z" fill="#c6d3ab" />
    <path d="m20 78 21-42 23 34m6-9 11-19 19 36M41 36l-1 33 14 14" />
    <path d="M40 35V13l26 6-26 8" fill="#edbf67" />
    <path d="M67 102c-23-13-20-18-6-25M15 108h94" />
  </>,
  clock: <>
    <path d="M53 16V8h17v8M91 26l8-8 9 9-9 8" fill="#edbf67" />
    <path d="M105 64c1 27-20 47-45 46S15 91 15 64s20-45 45-45 46 20 45 45Z" fill="#efcb7f" />
    <circle cx="60" cy="64" r="34" fill="#fffaf0" />
    <path d="M60 37v5m27 22h-5M60 91v-5m-27-22h5m22-16v17l17 10" />
    <circle cx="60" cy="64" r="3" fill="currentColor" />
    <path d="m10 27-6-6m18-6-2-8m84 94 8 4" />
  </>,
  boots: <>
    <path d="m22 25 36 3-2 32c1 10 13 14 26 15 13 1 19 10 17 23H19l-3-18Z" fill="#d6ae73" />
    <path d="m25 29-4 48 4 8h64M19 98v8h82v-9M38 43l21 2m-22 9 20 2m-16 9 19 3m-11 5 17 6" />
    <path d="m30 100 1 6m15-6v6m17-6v6m18-6v6" />
  </>,
  pack: <>
    <path d="M47 24v-9q13-11 26 0v9M28 49l-7 10v37h12m59-47 7 10v37H87" />
    <path d="M30 42c0-28 60-29 60 0v59q-28 12-60 0Z" fill="#e4b86b" />
    <path d="M31 43q28 21 58 0M47 46v16h9V49m11 0v13h9V46" fill="#fff4cf" />
    <rect x="41" y="71" width="38" height="25" rx="6" fill="#f5dba2" />
    <path d="M46 80h28m-6 0v5" />
  </>,
  lamp: <>
    <path d="M13 52q47-25 94 0v30q-47-19-94 0Z" fill="#a9bca9" />
    <rect x="35" y="43" width="51" height="45" rx="10" fill="#e7be74" />
    <circle cx="61" cy="65" r="16" fill="#fff8d9" />
    <path d="m52 59 5-5m-14-23-5-9m23 6V15m18 15 6-9" />
  </>,
  summit: <>
    <path d="M10 105 55 38l56 67Z" fill="#c1cba0" />
    <path d="m55 38 5 31 17 14M55 38V9l29 7-29 11" fill="#edbf67" />
    <path d="M60 106c-20-13-6-17 2-23 7-7-3-10-7-14" />
    <path d="m18 43 4-8m74 3 7-7M9 62H2m106-8 9-3" />
  </>,
};

export function TrailSketch({ kind, className }: { kind: keyof typeof drawings; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {drawings[kind]}
    </svg>
  );
}
