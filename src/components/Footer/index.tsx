"use client";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const handleAdminClick = () => {
    router.push("/admin/login");
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t pt-4 pb-4">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">

          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Tumen{" "}
              <span
                onClick={handleAdminClick}
                className="text-primary-600 dark:text-primary-400 cursor-pointer underline"
              >
                Sugalaa
              </span>
            </h3>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500">90171717</p>
            <p className="text-xs text-gray-400 mt-1">
              © 2026 Tumensugalaa.mn — By Meirmen International LLC
            </p>
          </div>

        </div>
              <div className="absolute top-0 right-0 z-[-1] opacity-5 dark:opacity-2">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="49.5" fill="#959CB1" />
        </svg>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
