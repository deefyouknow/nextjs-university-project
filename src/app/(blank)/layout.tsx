export default function BlankLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full bg-bg relative overflow-auto">
      {children}
    </div>
  );
}
