// Soft decorative circles behind the whole app. Purely visual, so it is hidden from screen readers.
export default function BackgroundShapes() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-20 top-28 h-72 w-72 rounded-full bg-brand-soft opacity-70" />
      <div className="absolute -right-16 top-1/2 h-52 w-52 rounded-full bg-brand-soft opacity-60" />
      <div className="absolute bottom-24 left-[15%] h-40 w-40 rounded-full bg-brand-soft opacity-60" />
      <div className="absolute bottom-10 right-[18%] h-24 w-24 rounded-full bg-brand-soft opacity-70" />
    </div>
  );
}
