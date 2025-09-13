"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "./Button";
import { Display } from "./Display";
import { History } from "./History";
import { calculatorAPI, type CalculationResponse } from "@/lib/calculator-api";

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  timestamp: Date;
}

export function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [isError, setIsError] = useState(false);
  const [isScientificMode, setIsScientificMode] = useState(false);
  const [angleMode, setAngleMode] = useState<"degree" | "radian">("degree");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [memory, setMemory] = useState(0);
  const [lastResult, setLastResult] = useState(0);

  // Health check on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await calculatorAPI.healthCheck();
        console.log("✅ Golang backend is connected");
      } catch (error) {
        console.error("❌ Golang backend connection failed:", error);
        setResult("Backend Error");
        setIsError(true);
      }
    };
    
    checkBackend();
  }, []);

  // Add to history
  const addToHistory = useCallback((expr: string, res: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      expression: expr,
      result: res,
      timestamp: new Date()
    };
    
    setHistory(prev => [...prev, newItem].slice(-50)); // Keep last 50 items
  }, []);

  // Handle input
  const handleInput = useCallback((value: string) => {
    if (isError) {
      setIsError(false);
      setExpression("");
      setResult("0");
    }

    if (value === "C") {
      setExpression("");
      setResult("0");
      setIsError(false);
    } else if (value === "CE") {
      setExpression(prev => prev.slice(0, -1));
    } else if (value === "=") {
      calculate();
    } else {
      setExpression(prev => prev + value);
    }
  }, [isError]);

  // Calculate expression
  const calculate = useCallback(async () => {
    if (!expression.trim()) return;
    
    setIsCalculating(true);
    
    try {
      const response: CalculationResponse = await calculatorAPI.evaluate(expression, angleMode);
      
      if (response.success) {
        const resultStr = response.result.toString();
        setResult(resultStr);
        setLastResult(response.result);
        addToHistory(expression, resultStr);
        setIsError(false);
      } else {
        setResult(response.error || "Error");
        setIsError(true);
      }
    } catch (error) {
      console.error("Calculation error:", error);
      setResult(error instanceof Error ? error.message : "Error");
      setIsError(true);
    } finally {
      setIsCalculating(false);
    }
  }, [expression, angleMode, addToHistory]);

  // Handle scientific function
  const handleScientificFunction = useCallback(async (funcName: string) => {
    const currentValue = expression ? parseFloat(expression) : lastResult;
    
    if (isNaN(currentValue)) {
      setResult("Invalid Input");
      setIsError(true);
      return;
    }

    setIsCalculating(true);
    
    try {
      const response: CalculationResponse = await calculatorAPI.scientificOperation(
        currentValue, 
        funcName, 
        angleMode
      );
      
      if (response.success) {
        const resultStr = response.result.toString();
        setResult(resultStr);
        setLastResult(response.result);
        addToHistory(`${funcName}(${currentValue})`, resultStr);
        setExpression("");
        setIsError(false);
      } else {
        setResult(response.error || "Error");
        setIsError(true);
      }
    } catch (error) {
      console.error("Scientific function error:", error);
      setResult(error instanceof Error ? error.message : "Error");
      setIsError(true);
    } finally {
      setIsCalculating(false);
    }
  }, [expression, lastResult, angleMode, addToHistory]);

  // Memory functions
  const handleMemoryOperation = useCallback((operation: string) => {
    const currentValue = parseFloat(result);
    if (isNaN(currentValue)) return;

    switch (operation) {
      case "MS": // Memory Store
        setMemory(currentValue);
        break;
      case "MR": // Memory Recall
        setExpression(memory.toString());
        break;
      case "MC": // Memory Clear
        setMemory(0);
        break;
      case "M+": // Memory Add
        setMemory(prev => prev + currentValue);
        break;
      case "M-": // Memory Subtract
        setMemory(prev => prev - currentValue);
        break;
    }
  }, [result, memory]);

  // Insert constants
  const insertConstant = useCallback(async (constantName: string) => {
    try {
      const response = await calculatorAPI.getConstants();
      const value = constantName === "π" ? response.constants.pi : response.constants.e;
      setExpression(prev => prev + value.toString());
    } catch (error) {
      console.error("Error getting constants:", error);
    }
  }, []);

  // History operations
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const selectFromHistory = useCallback((expr: string, res: string) => {
    setExpression(expr);
    setResult(res);
    setHistoryOpen(false);
  }, []);

  // Basic calculator buttons
  const basicButtons = [
    [
      { label: "C", variant: "clear" as const, action: () => handleInput("C") },
      { label: "CE", variant: "clear" as const, action: () => handleInput("CE") },
      { label: "⌫", variant: "secondary" as const, action: () => handleInput("CE") },
      { label: "÷", variant: "operator" as const, action: () => handleInput("/") }
    ],
    [
      { label: "7", variant: "primary" as const, action: () => handleInput("7") },
      { label: "8", variant: "primary" as const, action: () => handleInput("8") },
      { label: "9", variant: "primary" as const, action: () => handleInput("9") },
      { label: "×", variant: "operator" as const, action: () => handleInput("*") }
    ],
    [
      { label: "4", variant: "primary" as const, action: () => handleInput("4") },
      { label: "5", variant: "primary" as const, action: () => handleInput("5") },
      { label: "6", variant: "primary" as const, action: () => handleInput("6") },
      { label: "−", variant: "operator" as const, action: () => handleInput("-") }
    ],
    [
      { label: "1", variant: "primary" as const, action: () => handleInput("1") },
      { label: "2", variant: "primary" as const, action: () => handleInput("2") },
      { label: "3", variant: "primary" as const, action: () => handleInput("3") },
      { label: "+", variant: "operator" as const, action: () => handleInput("+") }
    ],
    [
      { label: "±", variant: "secondary" as const, action: () => handleInput("(-") },
      { label: "0", variant: "primary" as const, action: () => handleInput("0") },
      { label: ".", variant: "primary" as const, action: () => handleInput(".") },
      { label: "=", variant: "equals" as const, action: () => handleInput("=") }
    ]
  ];

  // Scientific calculator buttons
  const scientificButtons = [
    [
      { label: "sin", variant: "scientific" as const, action: () => handleScientificFunction("sin") },
      { label: "cos", variant: "scientific" as const, action: () => handleScientificFunction("cos") },
      { label: "tan", variant: "scientific" as const, action: () => handleScientificFunction("tan") },
      { label: "π", variant: "scientific" as const, action: () => insertConstant("π") }
    ],
    [
      { label: "asin", variant: "scientific" as const, action: () => handleScientificFunction("asin") },
      { label: "acos", variant: "scientific" as const, action: () => handleScientificFunction("acos") },
      { label: "atan", variant: "scientific" as const, action: () => handleScientificFunction("atan") },
      { label: "e", variant: "scientific" as const, action: () => insertConstant("e") }
    ],
    [
      { label: "log", variant: "scientific" as const, action: () => handleScientificFunction("log") },
      { label: "ln", variant: "scientific" as const, action: () => handleScientificFunction("ln") },
      { label: "exp", variant: "scientific" as const, action: () => handleScientificFunction("exp") },
      { label: "^", variant: "operator" as const, action: () => handleInput("^") }
    ],
    [
      { label: "√", variant: "scientific" as const, action: () => handleScientificFunction("sqrt") },
      { label: "x²", variant: "scientific" as const, action: () => handleInput("^2") },
      { label: "x!", variant: "scientific" as const, action: () => handleInput("!") },
      { label: "(", variant: "secondary" as const, action: () => handleInput("(") }
    ],
    [
      { label: "MS", variant: "secondary" as const, action: () => handleMemoryOperation("MS") },
      { label: "MR", variant: "secondary" as const, action: () => handleMemoryOperation("MR") },
      { label: "MC", variant: "secondary" as const, action: () => handleMemoryOperation("MC") },
      { label: ")", variant: "secondary" as const, action: () => handleInput(")") }
    ]
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <Display
        expression={expression}
        result={isCalculating ? "Calculating..." : result}
        isError={isError}
        mode={angleMode}
      />

      {/* Mode toggles */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-2">
          <Button
            onClick={() => setIsScientificMode(!isScientificMode)}
            variant={isScientificMode ? "scientific" : "secondary"}
            size="sm"
          >
            Scientific Mode
          </Button>
          
          <Button
            onClick={() => setAngleMode(angleMode === "degree" ? "radian" : "degree")}
            variant="secondary"
            size="sm"
          >
            {angleMode === "degree" ? "DEG" : "RAD"}
          </Button>
        </div>
        
        {memory !== 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Memory: {memory}
          </div>
        )}
      </div>

      {/* Calculator buttons */}
      <div className="p-4">
        {isScientificMode && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {scientificButtons.map((row, rowIndex) =>
              row.map((button, colIndex) => (
                <Button
                  key={`sci-${rowIndex}-${colIndex}`}
                  onClick={button.action}
                  variant={button.variant}
                  disabled={isCalculating}
                >
                  {button.label}
                </Button>
              ))
            )}
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {basicButtons.map((row, rowIndex) =>
            row.map((button, colIndex) => (
              <Button
                key={`basic-${rowIndex}-${colIndex}`}
                onClick={button.action}
                variant={button.variant}
                disabled={isCalculating}
              >
                {button.label}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* History */}
      <div className="px-4 pb-4">
        <History
          history={history}
          onClearHistory={clearHistory}
          onSelectHistory={selectFromHistory}
          isOpen={historyOpen}
          onToggle={() => setHistoryOpen(!historyOpen)}
        />
      </div>
    </div>
  );
}