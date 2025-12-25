
 import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function MaintenancePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 rounded-full p-4">
              <AlertCircle className="w-16 h-16 text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            Уучлаарай, 
          </h1>

          {/* Message */}
          <p className="text-gray-300 text-center mb-8 leading-relaxed">
            Алдаатай гүйлгээ засагдаж байна. Таны хийсэн гүйлгээ дарааллын дагуу орох болно.
          </p>


          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 text-center">
              90171717
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}