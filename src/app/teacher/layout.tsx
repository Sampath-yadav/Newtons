import { Providers } from "./Providers";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-[#0d1117] text-white">{children}</div>
    </Providers>
  );
}
