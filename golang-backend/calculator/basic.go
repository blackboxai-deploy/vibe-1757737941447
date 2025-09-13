package calculator

import (
	"errors"
	"math"
)

// BasicOperations provides basic mathematical operations
type BasicOperations struct{}

// NewBasicOperations creates a new BasicOperations instance
func NewBasicOperations() *BasicOperations {
	return &BasicOperations{}
}

// Add performs addition
func (b *BasicOperations) Add(a, b float64) float64 {
	return a + b
}

// Subtract performs subtraction
func (b *BasicOperations) Subtract(a, b float64) float64 {
	return a - b
}

// Multiply performs multiplication
func (b *BasicOperations) Multiply(a, b float64) float64 {
	return a * b
}

// Divide performs division with zero check
func (b *BasicOperations) Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

// Power calculates a^b
func (b *BasicOperations) Power(a, b float64) (float64, error) {
	result := math.Pow(a, b)
	if math.IsNaN(result) || math.IsInf(result, 0) {
		return 0, errors.New("invalid power operation")
	}
	return result, nil
}

// Percentage calculates percentage
func (b *BasicOperations) Percentage(value, percentage float64) float64 {
	return (value * percentage) / 100
}

// SquareRoot calculates square root
func (b *BasicOperations) SquareRoot(value float64) (float64, error) {
	if value < 0 {
		return 0, errors.New("cannot calculate square root of negative number")
	}
	return math.Sqrt(value), nil
}

// CubeRoot calculates cube root
func (b *BasicOperations) CubeRoot(value float64) float64 {
	if value >= 0 {
		return math.Pow(value, 1.0/3.0)
	}
	return -math.Pow(-value, 1.0/3.0)
}

// Factorial calculates factorial (for integers up to reasonable limit)
func (b *BasicOperations) Factorial(n float64) (float64, error) {
	if n < 0 {
		return 0, errors.New("factorial not defined for negative numbers")
	}
	if n != math.Floor(n) {
		return 0, errors.New("factorial only defined for integers")
	}
	if n > 170 {
		return 0, errors.New("factorial result too large")
	}
	
	result := 1.0
	for i := 1; i <= int(n); i++ {
		result *= float64(i)
	}
	return result, nil
}

// Absolute calculates absolute value
func (b *BasicOperations) Absolute(value float64) float64 {
	return math.Abs(value)
}

// Negate returns negative of value
func (b *BasicOperations) Negate(value float64) float64 {
	return -value
}