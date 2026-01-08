"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ADMIN_PASSWORD_HASH =
  "00f93369d5f8e4333ba16733b0e72dfd9836facb525d1955bddce6c98e48e88d"; 

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 30 * 60 * 1000; // 30 минут

async function sha256(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const Footer = () => {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const checkLockStatus = () => {
      const lockoutEnd = localStorage.getItem("adminLockoutEnd");
      if (lockoutEnd) {
        const endTime = parseInt(lockoutEnd);
        const now = Date.now();
        if (now < endTime) {
          setIsLocked(true);
          setRemainingTime(Math.ceil((endTime - now) / 1000));
        } else {
          localStorage.removeItem("adminLockoutEnd");
          localStorage.removeItem("adminAttempts");
          setIsLocked(false);
        }
      }
    };

    checkLockStatus();
    const interval = setInterval(checkLockStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminClick = async () => {
    if (isLocked) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      alert(`Та ${MAX_ATTEMPTS} удаа буруу оруулсан тул ${minutes}:${seconds.toString().padStart(2, '0')} хугацааны дараа дахин оролдоно уу.`);
      return;
    }

    const input = prompt("Нууц үгээ оруулна уу:");

    if (!input) return;

    const inputHash = await sha256(input);
    const attempts = parseInt(localStorage.getItem("adminAttempts") || "0");

    if (inputHash === ADMIN_PASSWORD_HASH) {
      localStorage.removeItem("adminAttempts");
      localStorage.removeItem("adminLockoutEnd");
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminAuthTime", Date.now().toString());
      router.push("/admin");
    } else {
      const newAttempts = attempts + 1;
      localStorage.setItem("adminAttempts", newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_TIME;
        localStorage.setItem("adminLockoutEnd", lockoutEnd.toString());
        setIsLocked(true);
        alert(`Та ${MAX_ATTEMPTS} удаа буруу оруулсан тул 30 минутын турш нууц үг оруулах боломжгүй болно.`);
      } else {
        alert(`Нууц үг буруу байна! Үлдсэн оролдлого: ${MAX_ATTEMPTS - newAttempts}`);
      }
    }
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
              © 2025 Tumen Sugalaa. Бүх эрх хуулиар хамгаалагдсан.
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
