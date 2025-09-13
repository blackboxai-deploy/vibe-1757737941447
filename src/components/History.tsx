"use client";

import { Button } from "./Button";

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistory: (expression: string, result: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function History({ history, onClearHistory, onSelectHistory, isOpen, onToggle }: HistoryProps) {
  return (
    <div className="mt-4">
      {/* History toggle button */}
      <div className="flex justify-between items-center mb-2">
        <Button
          onClick={onToggle}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          History {isOpen ? "▼" : "▶"} ({history.length})
        </Button>
      </div>

      {/* History panel */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-hidden">
          {/* History header */}
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Calculation History</h3>
            {history.length > 0 && (
              <Button
                onClick={onClearHistory}
                variant="clear"
                size="sm"
                className="px-2 py-1 text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          {/* History items */}
          <div className="overflow-y-auto max-h-48">
            {history.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No calculations yet
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.slice().reverse().map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectHistory(item.expression, item.result)}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {item.expression}
                        </div>
                        <div className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                          = {item.result}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                        {item.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}