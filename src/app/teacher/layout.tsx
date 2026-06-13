import { Providers } from "./Providers";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="bg-[#f8fafc] text-slate-800">{children}</div>
    </Providers>
  );
}
