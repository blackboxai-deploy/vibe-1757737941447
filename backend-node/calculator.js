// Calculator operations module

export class BasicOperations {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error("Division by zero");
    }
    return a / b;
  }

  power(a, b) {
    const result = Math.pow(a, b);
    if (!isFinite(result)) {
      throw new Error("Invalid power operation");
    }
    return result;
  }

  percentage(value, percentage) {
    return (value * percentage) / 100;
  }

  squareRoot(value) {
    if (value < 0) {
      throw new Error("Cannot calculate square root of negative number");
    }
    return Math.sqrt(value);
  }

  cubeRoot(value) {
    if (value >= 0) {
      return Math.pow(value, 1.0 / 3.0);
    }
    return -Math.pow(-value, 1.0 / 3.0);
  }

  factorial(n) {
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

  absolute(value) {
    return Math.abs(value);
  }

  negate(value) {
    return -value;
  }
}

export class ScientificOperations {
  constructor() {
    this.PI = Math.PI;
    this.E = Math.E;
  }

  getPi() {
    return this.PI;
  }

  getE() {
    return this.E;
  }

  degreesToRadians(degrees) {
    return degrees * (this.PI / 180.0);
  }

  radiansToDegrees(radians) {
    return radians * (180.0 / this.PI);
  }

  // Trigonometric functions
  sin(value, isDegree = true) {
    if (isDegree) {
      value = this.degreesToRadians(value);
    }
    return Math.sin(value);
  }

  cos(value, isDegree = true) {
    if (isDegree) {
      value = this.degreesToRadians(value);
    }
    return Math.cos(value);
  }

  tan(value, isDegree = true) {
    if (isDegree) {
      value = this.degreesToRadians(value);
    }
    
    const result = Math.tan(value);
    if (!isFinite(result)) {
      throw new Error("Tangent is undefined at this point");
    }
    return result;
  }

  // Inverse trigonometric functions
  asin(value, returnDegree = true) {
    if (value < -1 || value > 1) {
      throw new Error("Arcsin domain error: value must be between -1 and 1");
    }
    
    let result = Math.asin(value);
    if (returnDegree) {
      result = this.radiansToDegrees(result);
    }
    return result;
  }

  acos(value, returnDegree = true) {
    if (value < -1 || value > 1) {
      throw new Error("Arccos domain error: value must be between -1 and 1");
    }
    
    let result = Math.acos(value);
    if (returnDegree) {
      result = this.radiansToDegrees(result);
    }
    return result;
  }

  atan(value, returnDegree = true) {
    let result = Math.atan(value);
    if (returnDegree) {
      result = this.radiansToDegrees(result);
    }
    return result;
  }

  // Logarithmic functions
  log(value) {
    if (value <= 0) {
      throw new Error("Logarithm domain error: value must be positive");
    }
    return Math.log(value) / Math.log(10);
  }

  ln(value) {
    if (value <= 0) {
      throw new Error("Natural logarithm domain error: value must be positive");
    }
    return Math.log(value);
  }

  logBase(value, base) {
    if (value <= 0) {
      throw new Error("Logarithm domain error: value must be positive");
    }
    if (base <= 0 || base === 1) {
      throw new Error("Logarithm base error: base must be positive and not equal to 1");
    }
    return Math.log(value) / Math.log(base);
  }

  // Exponential functions
  exp(value) {
    const result = Math.exp(value);
    if (!isFinite(result)) {
      throw new Error("Exponential overflow");
    }
    return result;
  }

  exp10(value) {
    const result = Math.pow(10, value);
    if (!isFinite(result)) {
      throw new Error("Exponential overflow");
    }
    return result;
  }

  exp2(value) {
    const result = Math.pow(2, value);
    if (!isFinite(result)) {
      throw new Error("Exponential overflow");
    }
    return result;
  }

  // Hyperbolic functions
  sinh(value) {
    const result = (Math.exp(value) - Math.exp(-value)) / 2;
    if (!isFinite(result)) {
      throw new Error("Hyperbolic sine overflow");
    }
    return result;
  }

  cosh(value) {
    const result = (Math.exp(value) + Math.exp(-value)) / 2;
    if (!isFinite(result)) {
      throw new Error("Hyperbolic cosine overflow");
    }
    return result;
  }

  tanh(value) {
    const sinh = (Math.exp(value) - Math.exp(-value)) / 2;
    const cosh = (Math.exp(value) + Math.exp(-value)) / 2;
    return sinh / cosh;
  }

  // Additional functions
  floor(value) {
    return Math.floor(value);
  }

  ceil(value) {
    return Math.ceil(value);
  }

  round(value) {
    return Math.round(value);
  }
}

export class ExpressionParser {
  constructor() {
    this.basic = new BasicOperations();
    this.scientific = new ScientificOperations();
    this.isDegree = true;
  }

  setMode(isDegree) {
    this.isDegree = isDegree;
  }

  evaluate(expression) {
    // Clean the expression
    expression = this.cleanExpression(expression);
    
    // Replace constants
    expression = this.replaceConstants(expression);
    
    // Handle scientific functions
    expression = this.evaluateScientificFunctions(expression);
    
    // Evaluate the remaining arithmetic expression
    return this.evaluateArithmetic(expression);
  }

  cleanExpression(expr) {
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

  replaceConstants(expr) {
    expr = expr.replace(/π/g, Math.PI.toString());
    expr = expr.replace(/pi/g, Math.PI.toString());
    expr = expr.replace(/\be\b/g, Math.E.toString());
    return expr;
  }

  evaluateScientificFunctions(expr) {
    // Define function patterns
    const functions = {
      sin: (x) => this.scientific.sin(x, this.isDegree),
      cos: (x) => this.scientific.cos(x, this.isDegree),
      tan: (x) => this.scientific.tan(x, this.isDegree),
      asin: (x) => this.scientific.asin(x, this.isDegree),
      acos: (x) => this.scientific.acos(x, this.isDegree),
      atan: (x) => this.scientific.atan(x, this.isDegree),
      log: (x) => this.scientific.log(x),
      ln: (x) => this.scientific.ln(x),
      exp: (x) => this.scientific.exp(x),
      sqrt: (x) => this.basic.squareRoot(x),
      abs: (x) => this.basic.absolute(x),
      floor: (x) => this.scientific.floor(x),
      ceil: (x) => this.scientific.ceil(x),
      round: (x) => this.scientific.round(x)
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

  evaluateArithmetic(expr) {
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

  evaluateSimpleExpression(expr) {
    // Handle power operations first (highest precedence)
    expr = this.evaluatePowerOperations(expr);
    
    // Handle multiplication and division (left to right)
    expr = this.evaluateMultiplicationDivision(expr);
    
    // Handle addition and subtraction (left to right)
    return this.evaluateAdditionSubtraction(expr);
  }

  evaluatePowerOperations(expr) {
    const powerPattern = /(-?\d+(?:\.\d+)?)(\^|\*\*)(-?\d+(?:\.\d+)?)/;
    
    while (powerPattern.test(expr)) {
      const match = expr.match(powerPattern);
      const base = parseFloat(match[1]);
      const exponent = parseFloat(match[3]);
      const result = this.basic.power(base, exponent);
      expr = expr.replace(match[0], result.toString());
    }
    
    return expr;
  }

  evaluateMultiplicationDivision(expr) {
    const mdPattern = /(-?\d+(?:\.\d+)?)([*/])(-?\d+(?:\.\d+)?)/;
    
    while (mdPattern.test(expr)) {
      const match = expr.match(mdPattern);
      const left = parseFloat(match[1]);
      const right = parseFloat(match[3]);
      
      let result;
      if (match[2] === '*') {
        result = this.basic.multiply(left, right);
      } else {
        result = this.basic.divide(left, right);
      }
      
      expr = expr.replace(match[0], result.toString());
    }
    
    return expr;
  }

  evaluateAdditionSubtraction(expr) {
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