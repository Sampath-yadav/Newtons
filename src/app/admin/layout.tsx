import { Providers } from "~/app/teacher/Providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="bg-[#f8fafc]">{children}</div>
    </Providers>
  );
}
