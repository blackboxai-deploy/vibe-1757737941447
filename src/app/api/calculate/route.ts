import { NextRequest, NextResponse } from 'next/server';

// Calculator operations - Basic Operations
class BasicOperations {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Division by zero");
    }
    return a / b;
  }

  power(a: number, b: number): number {
    const result = Math.pow(a, b);
    if (!isFinite(result)) {
      throw new Error("Invalid power operation");
    }
    return result;
  }

  squareRoot(value: number): number {
    if (value < 0) {
      throw new Error("Cannot calculate square root of negative number");
    }
    return Math.sqrt(value);
  }

  factorial(n: number): number {
    if (n < 0) {
      throw new Error("Factorial not defined for negative numbers");
    }
    if (n !== Math.floor(n)) {
      throw new Error("Factorial only defined for integers");
    }
    if (n > 170) {
      throw new Error("Factorial result too large");
    }
    
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  absolute(value: number): number {
    return Math.abs(value);
  }
}

// Scientific Operations
class ScientificOperations {
  private readonly PI = Math.PI;
  private readonly E = Math.E;

  getPi(): number {
    return this.PI;
  }

  getE(): number {
    return this.E;
  }

  degreesToRadians(degrees: number): number {
    return degrees * (this.PI / 180.0);
  }

  radiansToDegrees(radians: number): number {
    return radians * (180.0 / this.PI);
  }

  // Trigonometric functions
  sin(value: number, isDegree: boolean = true): number {
    if (isDegree) {
      value = this.degreesToRadians(value);
    }
    return Math.sin(value);
  }

  cos(value: number, isDegree: boolean = true): number {
    if (isDegree) {
      value = this.degreesToRadians(value);
    }
    return Math.cos(value);
  }

  tan(value: number, isDegree: boolean = true): number {
    if (isDegree) {
      value = this.degreesToRadians(value);
    }
    
    const result = Math.tan(value);
    if (!isFinite(result)) {
      throw new Error("Tangent is undefined at this point");
    }
    return result;
  }

  // Logarithmic functions  
  log(value: number): number {
    if (value <= 0) {
      throw new Error("Logarithm domain error: value must be positive");
    }
    return Math.log(value) / Math.log(10);
  }

  ln(value: number): number {
    if (value <= 0) {
      throw new Error("Natural logarithm domain error: value must be positive");
    }
    return Math.log(value);
  }

  // Exponential functions
  exp(value: number): number {
    const result = Math.exp(value);
    if (!isFinite(result)) {
      throw new Error("Exponential overflow");
    }
    return result;
  }
}

// Expression Parser
class ExpressionParser {
  private basic = new BasicOperations();
  private scientific = new ScientificOperations();
  private isDegree = true;

  setMode(isDegree: boolean): void {
    this.isDegree = isDegree;
  }

  evaluate(expression: string): number {
    // Clean the expression
    expression = this.cleanExpression(expression);
    
    // Replace constants
    expression = this.replaceConstants(expression);
    
    // Handle scientific functions
    expression = this.evaluateScientificFunctions(expression);
    
    // Evaluate the remaining arithmetic expression
    return this.evaluateArithmetic(expression);
  }

  private cleanExpression(expr: string): string {
    // Remove all whitespace
    expr = expr.replace(/\s+/g, '');
    
    // Replace common operator variations
    expr = expr.replace(/×/g, '*');
    expr = expr.replace(/÷/g, '/');
    expr = expr.replace(/−/g, '-');
    
    // Handle implicit multiplication
    expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    expr = expr.replace(/([a-zA-Z])(\d)/g, '$1*$2');
    expr = expr.replace(/(\))(\()/g, '$1*$2');
    expr = expr.replace(/(\d)(\()/g, '$1*$2');
    expr = expr.replace(/(\))(\d)/g, '$1*$2');
    
    return expr;
  }

  private replaceConstants(expr: string): string {
    expr = expr.replace(/π/g, Math.PI.toString());
    expr = expr.replace(/pi/g, Math.PI.toString());
    expr = expr.replace(/\be\b/g, Math.E.toString());
    return expr;
  }

  private evaluateScientificFunctions(expr: string): string {
    // Define function patterns
    const functions: Record<string, (x: number) => number> = {
      sin: (x) => this.scientific.sin(x, this.isDegree),
      cos: (x) => this.scientific.cos(x, this.isDegree),
      tan: (x) => this.scientific.tan(x, this.isDegree),
      log: (x) => this.scientific.log(x),
      ln: (x) => this.scientific.ln(x),
      exp: (x) => this.scientific.exp(x),
      sqrt: (x) => this.basic.squareRoot(x),
      abs: (x) => this.basic.absolute(x)
    };

    // Process each function
    for (const funcName of Object.keys(functions)) {
      const funcEval = functions[funcName];
      const pattern = new RegExp(`${funcName}\\(([^()]+)\\)`, 'g');
      
      let match;
      while ((match = pattern.exec(expr)) !== null) {
        const argValue = this.evaluateArithmetic(match[1]);
        const result = funcEval(argValue);
        expr = expr.replace(match[0], result.toString());
        pattern.lastIndex = 0; // Reset pattern to start over
      }
    }

    // Handle factorial separately (postfix operator)
    const factorialPattern = /(\d+(?:\.\d+)?)!/g;
    let factorialMatch;
    while ((factorialMatch = factorialPattern.exec(expr)) !== null) {
      const value = parseFloat(factorialMatch[1]);
      const result = this.basic.factorial(value);
      expr = expr.replace(factorialMatch[0], result.toString());
      factorialPattern.lastIndex = 0;
    }

    return expr;
  }

  private evaluateArithmetic(expr: string): number {
    if (expr === '') {
      throw new Error('Empty expression');
    }

    // Handle parentheses first
    while (expr.includes('(')) {
      const start = expr.lastIndexOf('(');
      const end = expr.indexOf(')', start);
      
      if (end === -1) {
        throw new Error('Mismatched parentheses');
      }
      
      const inner = expr.substring(start + 1, end);
      const result = this.evaluateArithmetic(inner);
      expr = expr.substring(0, start) + result.toString() + expr.substring(end + 1);
    }

    return this.evaluateSimpleExpression(expr);
  }

  private evaluateSimpleExpression(expr: string): number {
    // Handle power operations first (highest precedence)
    expr = this.evaluatePowerOperations(expr);
    
    // Handle multiplication and division (left to right)
    expr = this.evaluateMultiplicationDivision(expr);
    
    // Handle addition and subtraction (left to right)
    return this.evaluateAdditionSubtraction(expr);
  }

  private evaluatePowerOperations(expr: string): string {
    const powerPattern = /(-?\d+(?:\.\d+)?)(\^|\*\*)(-?\d+(?:\.\d+)?)/;
    
    while (powerPattern.test(expr)) {
      const match = expr.match(powerPattern);
      if (match) {
        const base = parseFloat(match[1]);
        const exponent = parseFloat(match[3]);
        const result = this.basic.power(base, exponent);
        expr = expr.replace(match[0], result.toString());
      }
    }
    
    return expr;
  }

  private evaluateMultiplicationDivision(expr: string): string {
    const mdPattern = /(-?\d+(?:\.\d+)?)([*/])(-?\d+(?:\.\d+)?)/;
    
    while (mdPattern.test(expr)) {
      const match = expr.match(mdPattern);
      if (match) {
        const left = parseFloat(match[1]);
        const right = parseFloat(match[3]);
        
        let result: number;
        if (match[2] === '*') {
          result = this.basic.multiply(left, right);
        } else {
          result = this.basic.divide(left, right);
        }
        
        expr = expr.replace(match[0], result.toString());
      }
    }
    
    return expr;
  }

  private evaluateAdditionSubtraction(expr: string): number {
    // Split by + and - operators while preserving the operators
    const parts = expr.split(/([+-])/);
    
    if (parts.length === 0) {
      throw new Error('Invalid expression');
    }

    // Parse the first number
    let result = parseFloat(parts[0]);
    if (isNaN(result)) {
      throw new Error(`Invalid number: ${parts[0]}`);
    }

    // Apply subsequent operations
    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i];
      const operand = parseFloat(parts[i + 1]);
      
      if (isNaN(operand)) {
        throw new Error(`Invalid operand: ${parts[i + 1]}`);
      }

      if (operator === '+') {
        result = this.basic.add(result, operand);
      } else if (operator === '-') {
        result = this.basic.subtract(result, operand);
      }
    }

    return result;
  }
}

// Initialize calculator instances
const parser = new ExpressionParser();

export async function POST(request: NextRequest) {
  try {
    const { expression, mode } = await request.json();
    
    if (!expression) {
      return NextResponse.json({
        original: '',
        success: false,
        error: 'Expression is required'
      }, { status: 400 });
    }

    // Set angle mode
    const isDegree = mode !== 'radian';
    parser.setMode(isDegree);

    // Evaluate the expression
    const result = parser.evaluate(expression);

    return NextResponse.json({
      result: result,
      original: expression,
      success: true
    });

  } catch (error) {
    console.error('Expression evaluation error:', error);
    return NextResponse.json({
      original: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}