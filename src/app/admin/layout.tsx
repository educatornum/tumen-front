"use client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Админ хэсэгт Header/Footer байхгүй */}
        {children}
      </body>
    </html>
  );
}
