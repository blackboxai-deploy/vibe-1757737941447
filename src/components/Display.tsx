"use client";

interface DisplayProps {
  expression: string;
  result: string;
  isError: boolean;
  mode: string;
}

export function Display({ expression, result, isError, mode }: DisplayProps) {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-t-2xl shadow-inner">
      {/* Mode indicator */}
      <div className="flex justify-end mb-2">
        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
          {mode.toUpperCase()}
        </span>
      </div>

      {/* Expression display */}
      <div className="text-right mb-2">
        <div className="text-sm text-gray-400 h-6 overflow-hidden">
          {expression || "0"}
        </div>
      </div>

      {/* Result display */}
      <div className="text-right">
        <div 
          className={`text-3xl font-light min-h-[2.5rem] flex items-center justify-end overflow-hidden ${
            isError ? 'text-red-400' : 'text-white'
          }`}
        >
          {result || "0"}
        </div>
      </div>
    </div>
  );
}