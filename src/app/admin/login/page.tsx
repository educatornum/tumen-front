"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, User } from "lucide-react";

const USERNAME_HASH = "8b3ce0c3977ee6e8d53efeb1fb5b4f82bfb85e44b706c4eded197bd78875da67";
const PASSWORD_HASH = "d92119fcd0efbe6d2b18e37efac9f1d7ae79e07eb9a5ebe4ca3fe1bafa0df8e1";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 60 * 1000;

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    const tokenTime = sessionStorage.getItem("adminTokenTime");
    if (token && tokenTime && Date.now() - parseInt(tokenTime) < 60 * 60 * 1000) {
      router.replace("/admin");
      return;
    }
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminTokenTime");

    const lockoutEnd = sessionStorage.getItem("adminLockoutEnd");
    const savedAttempts = sessionStorage.getItem("adminAttempts");
    if (lockoutEnd) {
      const end = parseInt(lockoutEnd);
      if (Date.now() < end) setLockedUntil(end);
      else {
        sessionStorage.removeItem("adminLockoutEnd");
        sessionStorage.removeItem("adminAttempts");
      }
    }
    if (savedAttempts) setAttempts(parseInt(savedAttempts));
  }, [router]);

  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const left = lockedUntil - Date.now();
      if (left <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        sessionStorage.removeItem("adminLockoutEnd");
        sessionStorage.removeItem("adminAttempts");
        clearInterval(interval);
      } else {
        setRemaining(Math.ceil(left / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntil) return;
    setLoading(true);
    setError("");

    const [uHash, pHash] = await Promise.all([sha256(username), sha256(password)]);

    if (uHash === USERNAME_HASH && pHash === PASSWORD_HASH) {
      const token = crypto.randomUUID();
      sessionStorage.setItem("adminToken", token);
      sessionStorage.setItem("adminTokenTime", Date.now().toString());
      sessionStorage.removeItem("adminAttempts");
      sessionStorage.removeItem("adminLockoutEnd");
      router.push("/admin");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      sessionStorage.setItem("adminAttempts", newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const end = Date.now() + LOCKOUT_MS;
        sessionStorage.setItem("adminLockoutEnd", end.toString());
        setLockedUntil(end);
        setError(`${MAX_ATTEMPTS} удаа буруу оруулсан тул 30 минутын турш хаагдлаа.`);
      } else {
        setError(`Хэрэглэгчийн нэр эсвэл нууц үг буруу. Үлдсэн: ${MAX_ATTEMPTS - newAttempts}`);
      }
      setPassword("");
    }

    setLoading(false);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Админ нэвтрэх</h1>
          <p className="text-slate-400 text-sm mt-1">Түмэн сугалаа</p>
        </div>

        {lockedUntil ? (
          <div className="text-center text-rose-400 bg-rose-900/30 rounded-xl p-4">
            <p className="font-semibold">Хандалт түр хаагдсан</p>
            <p className="text-sm mt-1">
              {minutes}:{seconds.toString().padStart(2, "0")} дараа дахин оролдоно уу
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Хэрэглэгчийн нэр"
                autoFocus
                required
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-slate-600"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үг"
                required
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-rose-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-orange-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Шалгаж байна..." : "Нэвтрэх"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
