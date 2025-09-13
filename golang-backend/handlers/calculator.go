package handlers

import (
	"calculator-backend/calculator"
	"calculator-backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CalculatorHandler handles calculator-related HTTP requests
type CalculatorHandler struct {
	basic      *calculator.BasicOperations
	scientific *calculator.ScientificOperations
	parser     *calculator.ExpressionParser
}

// NewCalculatorHandler creates a new CalculatorHandler
func NewCalculatorHandler() *CalculatorHandler {
	return &CalculatorHandler{
		basic:      calculator.NewBasicOperations(),
		scientific: calculator.NewScientificOperations(),
		parser:     calculator.NewExpressionParser(),
	}
}

// EvaluateExpression handles expression evaluation
func (h *CalculatorHandler) EvaluateExpression(c *gin.Context) {
	var req models.CalculationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request format",
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	// Set angle mode if specified
	if req.Mode == "radian" {
		h.parser.SetMode(false)
	} else {
		h.parser.SetMode(true) // Default to degree
	}

	// Evaluate the expression
	result, err := h.parser.Evaluate(req.Expression)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.CalculationResponse{
			Original: req.Expression,
			Success:  false,
			Error:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.CalculationResponse{
		Result:   result,
		Original: req.Expression,
		Success:  true,
	})
}

// BasicOperation handles basic arithmetic operations
func (h *CalculatorHandler) BasicOperation(c *gin.Context) {
	var req models.BasicOperationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request format",
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	var result float64
	var err error

	switch req.Operator {
	case "+":
		result = h.basic.Add(req.A, req.B)
	case "-":
		result = h.basic.Subtract(req.A, req.B)
	case "*", "×":
		result = h.basic.Multiply(req.A, req.B)
	case "/", "÷":
		result, err = h.basic.Divide(req.A, req.B)
	case "^", "**":
		result, err = h.basic.Power(req.A, req.B)
	case "%":
		result = h.basic.Percentage(req.A, req.B)
	default:
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Unsupported operator",
			Code:    400,
			Message: "Supported operators: +, -, *, /, ^, %",
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, models.CalculationResponse{
			Original: req.Operator,
			Success:  false,
			Error:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.CalculationResponse{
		Result:   result,
		Original: req.Operator,
		Success:  true,
	})
}

// ScientificOperation handles scientific mathematical operations
func (h *CalculatorHandler) ScientificOperation(c *gin.Context) {
	var req models.ScientificOperationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request format",
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	isDegree := req.Mode != "radian"
	var result float64
	var err error

	switch req.Function {
	case "sin":
		result = h.scientific.Sin(req.Value, isDegree)
	case "cos":
		result = h.scientific.Cos(req.Value, isDegree)
	case "tan":
		result, err = h.scientific.Tan(req.Value, isDegree)
	case "asin":
		result, err = h.scientific.Asin(req.Value, isDegree)
	case "acos":
		result, err = h.scientific.Acos(req.Value, isDegree)
	case "atan":
		result = h.scientific.Atan(req.Value, isDegree)
	case "log":
		result, err = h.scientific.Log(req.Value)
	case "ln":
		result, err = h.scientific.Ln(req.Value)
	case "exp":
		result, err = h.scientific.Exp(req.Value)
	case "sqrt":
		result, err = h.basic.SquareRoot(req.Value)
	case "cbrt":
		result = h.basic.CubeRoot(req.Value)
	case "abs":
		result = h.basic.Absolute(req.Value)
	case "factorial":
		result, err = h.basic.Factorial(req.Value)
	case "floor":
		result = h.scientific.Floor(req.Value)
	case "ceil":
		result = h.scientific.Ceil(req.Value)
	case "round":
		result = h.scientific.Round(req.Value)
	case "sinh":
		result, err = h.scientific.Sinh(req.Value)
	case "cosh":
		result, err = h.scientific.Cosh(req.Value)
	case "tanh":
		result = h.scientific.Tanh(req.Value)
	default:
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Unsupported function",
			Code:    400,
			Message: "Function not supported: " + req.Function,
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, models.CalculationResponse{
			Original: req.Function,
			Success:  false,
			Error:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.CalculationResponse{
		Result:   result,
		Original: req.Function,
		Success:  true,
	})
}

// GetConstants returns mathematical constants
func (h *CalculatorHandler) GetConstants(c *gin.Context) {
	constants := gin.H{
		"pi": h.scientific.GetPi(),
		"e":  h.scientific.GetE(),
	}

	c.JSON(http.StatusOK, gin.H{
		"constants": constants,
		"success":   true,
	})
}

// HealthCheck provides a simple health check endpoint
func (h *CalculatorHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"message": "Calculator API is running",
		"version": "1.0.0",
	})
}

// ConvertAngle converts between degrees and radians
func (h *CalculatorHandler) ConvertAngle(c *gin.Context) {
	valueStr := c.Query("value")
	fromMode := c.Query("from")
	toMode := c.Query("to")

	if valueStr == "" || fromMode == "" || toMode == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Missing parameters",
			Code:    400,
			Message: "Required parameters: value, from, to",
		})
		return
	}

	value, err := strconv.ParseFloat(valueStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid value",
			Code:    400,
			Message: "Value must be a number",
		})
		return
	}

	var result float64

	if fromMode == "degree" && toMode == "radian" {
		result = h.scientific.DegreesToRadians(value)
	} else if fromMode == "radian" && toMode == "degree" {
		result = h.scientific.RadiansToDegrees(value)
	} else {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid conversion",
			Code:    400,
			Message: "Supported conversions: degree to radian, radian to degree",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"original": value,
		"result":   result,
		"from":     fromMode,
		"to":       toMode,
		"success":  true,
	})
}