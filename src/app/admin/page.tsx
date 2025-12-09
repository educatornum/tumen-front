import { Metadata } from "next";
import AdminDashboard from "./components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Түмэн сугалаа админ хэсэг",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
