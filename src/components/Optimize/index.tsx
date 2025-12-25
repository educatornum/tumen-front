export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white px-4">
      <div className="text-center max-w-xl">
        {/* Icon */}
        <div className="text-6xl mb-6 animate-pulse">🎄</div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Түр хүлээнэ үү
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed">
          Манай системд төлөвлөгөөт сайжруулалт болон шинэ жилийн
           уур амьсгал оруулах ажлууд хийгдэж байна.
          <br />
          Та түр хүлээнэ үү.
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-white/30 mx-auto mb-6 rounded-full" />

        {/* Footer message */}
        <p className="text-sm text-gray-300">
          🎆 Шинэ оноо угтахад бэлдэж байна 🎆
        </p>

        {/* Loading dots */}
        <div className="mt-6 flex justify-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
          <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
        </div>
      </div>
    </div>
  );
}
