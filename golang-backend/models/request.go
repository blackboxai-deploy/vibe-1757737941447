package models

// CalculationRequest represents the request payload for calculations
type CalculationRequest struct {
	Expression string `json:"expression" binding:"required"`
	Mode       string `json:"mode,omitempty"` // "degree" or "radian" for trigonometric functions
}

// CalculationResponse represents the response payload for calculations
type CalculationResponse struct {
	Result   float64 `json:"result"`
	Original string  `json:"original"`
	Success  bool    `json:"success"`
	Error    string  `json:"error,omitempty"`
}

// BasicOperationRequest for simple operations
type BasicOperationRequest struct {
	A        float64 `json:"a" binding:"required"`
	B        float64 `json:"b" binding:"required"`
	Operator string  `json:"operator" binding:"required"`
}

// ScientificOperationRequest for scientific functions
type ScientificOperationRequest struct {
	Value    float64 `json:"value" binding:"required"`
	Function string  `json:"function" binding:"required"`
	Mode     string  `json:"mode,omitempty"` // "degree" or "radian"
}

// HistoryResponse for calculation history
type HistoryResponse struct {
	ID         int     `json:"id"`
	Expression string  `json:"expression"`
	Result     float64 `json:"result"`
	Timestamp  string  `json:"timestamp"`
}

// ErrorResponse for error handling
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    int    `json:"code"`
	Message string `json:"message"`
}