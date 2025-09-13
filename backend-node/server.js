import express from 'express';
import cors from 'cors';
import { BasicOperations, ScientificOperations, ExpressionParser } from './calculator.js';

const app = express();
const port = 8080;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize calculator instances
const basicOps = new BasicOperations();
const scientificOps = new ScientificOperations();
const parser = new ExpressionParser();

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Scientific Calculator API',
    version: '1.0.0',
    description: 'A powerful scientific calculator API built with Node.js',
    endpoints: {
      health: '/api/health',
      calculate: 'POST /api/calculate',
      basic: 'POST /api/basic',
      scientific: 'POST /api/scientific',
      constants: '/api/constants',
      convertAngle: '/api/convert-angle'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Calculator API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Evaluate expression endpoint
app.post('/api/calculate', (req, res) => {
  try {
    const { expression, mode } = req.body;
    
    if (!expression) {
      return res.status(400).json({
        original: '',
        success: false,
        error: 'Expression is required'
      });
    }

    // Set angle mode
    const isDegree = mode !== 'radian';
    parser.setMode(isDegree);

    // Evaluate the expression
    const result = parser.evaluate(expression);

    res.json({
      result: result,
      original: expression,
      success: true
    });

  } catch (error) {
    console.error('Expression evaluation error:', error);
    res.status(400).json({
      original: req.body.expression || '',
      success: false,
      error: error.message
    });
  }
});

// Basic operation endpoint
app.post('/api/basic', (req, res) => {
  try {
    const { a, b, operator } = req.body;
    
    if (typeof a !== 'number' || typeof b !== 'number' || !operator) {
      return res.status(400).json({
        original: operator || '',
        success: false,
        error: 'Invalid request format: a, b (numbers) and operator (string) are required'
      });
    }

    let result;
    
    switch (operator) {
      case '+':
        result = basicOps.add(a, b);
        break;
      case '-':
        result = basicOps.subtract(a, b);
        break;
      case '*':
      case '×':
        result = basicOps.multiply(a, b);
        break;
      case '/':
      case '÷':
        result = basicOps.divide(a, b);
        break;
      case '^':
      case '**':
        result = basicOps.power(a, b);
        break;
      case '%':
        result = basicOps.percentage(a, b);
        break;
      default:
        return res.status(400).json({
          original: operator,
          success: false,
          error: 'Unsupported operator. Supported operators: +, -, *, /, ^, %'
        });
    }

    res.json({
      result: result,
      original: operator,
      success: true
    });

  } catch (error) {
    console.error('Basic operation error:', error);
    res.status(400).json({
      original: req.body.operator || '',
      success: false,
      error: error.message
    });
  }
});

// Scientific operation endpoint
app.post('/api/scientific', (req, res) => {
  try {
    const { value, function: functionName, mode } = req.body;
    
    if (typeof value !== 'number' || !functionName) {
      return res.status(400).json({
        original: functionName || '',
        success: false,
        error: 'Invalid request format: value (number) and function (string) are required'
      });
    }

    const isDegree = mode !== 'radian';
    let result;

    switch (functionName) {
      case 'sin':
        result = scientificOps.sin(value, isDegree);
        break;
      case 'cos':
        result = scientificOps.cos(value, isDegree);
        break;
      case 'tan':
        result = scientificOps.tan(value, isDegree);
        break;
      case 'asin':
        result = scientificOps.asin(value, isDegree);
        break;
      case 'acos':
        result = scientificOps.acos(value, isDegree);
        break;
      case 'atan':
        result = scientificOps.atan(value, isDegree);
        break;
      case 'log':
        result = scientificOps.log(value);
        break;
      case 'ln':
        result = scientificOps.ln(value);
        break;
      case 'exp':
        result = scientificOps.exp(value);
        break;
      case 'sqrt':
        result = basicOps.squareRoot(value);
        break;
      case 'cbrt':
        result = basicOps.cubeRoot(value);
        break;
      case 'abs':
        result = basicOps.absolute(value);
        break;
      case 'factorial':
        result = basicOps.factorial(value);
        break;
      case 'floor':
        result = scientificOps.floor(value);
        break;
      case 'ceil':
        result = scientificOps.ceil(value);
        break;
      case 'round':
        result = scientificOps.round(value);
        break;
      case 'sinh':
        result = scientificOps.sinh(value);
        break;
      case 'cosh':
        result = scientificOps.cosh(value);
        break;
      case 'tanh':
        result = scientificOps.tanh(value);
        break;
      default:
        return res.status(400).json({
          original: functionName,
          success: false,
          error: 'Function not supported: ' + functionName
        });
    }

    res.json({
      result: result,
      original: functionName,
      success: true
    });

  } catch (error) {
    console.error('Scientific operation error:', error);
    res.status(400).json({
      original: req.body.function || '',
      success: false,
      error: error.message
    });
  }
});

// Constants endpoint
app.get('/api/constants', (req, res) => {
  res.json({
    constants: {
      pi: scientificOps.getPi(),
      e: scientificOps.getE()
    },
    success: true
  });
});

// Angle conversion endpoint
app.get('/api/convert-angle', (req, res) => {
  try {
    const { value, from, to } = req.query;

    if (!value || !from || !to) {
      return res.status(400).json({
        error: 'Missing parameters',
        code: 400,
        message: 'Required parameters: value, from, to'
      });
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return res.status(400).json({
        error: 'Invalid value',
        code: 400,
        message: 'Value must be a number'
      });
    }

    let result;

    if (from === 'degree' && to === 'radian') {
      result = scientificOps.degreesToRadians(numValue);
    } else if (from === 'radian' && to === 'degree') {
      result = scientificOps.radiansToDegrees(numValue);
    } else {
      return res.status(400).json({
        error: 'Invalid conversion',
        code: 400,
        message: 'Supported conversions: degree to radian, radian to degree'
      });
    }

    res.json({
      original: numValue,
      result: result,
      from: from,
      to: to,
      success: true
    });

  } catch (error) {
    console.error('Angle conversion error:', error);
    res.status(500).json({
      error: 'Conversion failed',
      code: 500,
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    code: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 404,
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Scientific Calculator API running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`📱 API Documentation: http://localhost:${port}`);
});