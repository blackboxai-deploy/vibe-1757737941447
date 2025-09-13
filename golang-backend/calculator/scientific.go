package calculator

import (
	"errors"
	"math"
)

// ScientificOperations provides scientific mathematical operations
type ScientificOperations struct{}

// NewScientificOperations creates a new ScientificOperations instance
func NewScientificOperations() *ScientificOperations {
	return &ScientificOperations{}
}

// Constants
const (
	PI = math.Pi
	E  = math.E
)

// GetPi returns the value of Pi
func (s *ScientificOperations) GetPi() float64 {
	return PI
}

// GetE returns the value of Euler's number
func (s *ScientificOperations) GetE() float64 {
	return E
}

// DegreesToRadians converts degrees to radians
func (s *ScientificOperations) DegreesToRadians(degrees float64) float64 {
	return degrees * (PI / 180.0)
}

// RadiansToDegrees converts radians to degrees
func (s *ScientificOperations) RadiansToDegrees(radians float64) float64 {
	return radians * (180.0 / PI)
}

// Trigonometric Functions

// Sin calculates sine
func (s *ScientificOperations) Sin(value float64, isDegree bool) float64 {
	if isDegree {
		value = s.DegreesToRadians(value)
	}
	return math.Sin(value)
}

// Cos calculates cosine
func (s *ScientificOperations) Cos(value float64, isDegree bool) float64 {
	if isDegree {
		value = s.DegreesToRadians(value)
	}
	return math.Cos(value)
}

// Tan calculates tangent
func (s *ScientificOperations) Tan(value float64, isDegree bool) (float64, error) {
	if isDegree {
		value = s.DegreesToRadians(value)
	}
	
	result := math.Tan(value)
	if math.IsInf(result, 0) {
		return 0, errors.New("tangent is undefined at this point")
	}
	return result, nil
}

// Inverse Trigonometric Functions

// Asin calculates inverse sine (arcsin)
func (s *ScientificOperations) Asin(value float64, returnDegree bool) (float64, error) {
	if value < -1 || value > 1 {
		return 0, errors.New("arcsin domain error: value must be between -1 and 1")
	}
	
	result := math.Asin(value)
	if returnDegree {
		result = s.RadiansToDegrees(result)
	}
	return result, nil
}

// Acos calculates inverse cosine (arccos)
func (s *ScientificOperations) Acos(value float64, returnDegree bool) (float64, error) {
	if value < -1 || value > 1 {
		return 0, errors.New("arccos domain error: value must be between -1 and 1")
	}
	
	result := math.Acos(value)
	if returnDegree {
		result = s.RadiansToDegrees(result)
	}
	return result, nil
}

// Atan calculates inverse tangent (arctan)
func (s *ScientificOperations) Atan(value float64, returnDegree bool) float64 {
	result := math.Atan(value)
	if returnDegree {
		result = s.RadiansToDegrees(result)
	}
	return result
}

// Logarithmic Functions

// Log calculates base-10 logarithm
func (s *ScientificOperations) Log(value float64) (float64, error) {
	if value <= 0 {
		return 0, errors.New("logarithm domain error: value must be positive")
	}
	return math.Log10(value), nil
}

// Ln calculates natural logarithm (base-e)
func (s *ScientificOperations) Ln(value float64) (float64, error) {
	if value <= 0 {
		return 0, errors.New("natural logarithm domain error: value must be positive")
	}
	return math.Log(value), nil
}

// LogBase calculates logarithm with custom base
func (s *ScientificOperations) LogBase(value, base float64) (float64, error) {
	if value <= 0 {
		return 0, errors.New("logarithm domain error: value must be positive")
	}
	if base <= 0 || base == 1 {
		return 0, errors.New("logarithm base error: base must be positive and not equal to 1")
	}
	return math.Log(value) / math.Log(base), nil
}

// Exponential Functions

// Exp calculates e^x
func (s *ScientificOperations) Exp(value float64) (float64, error) {
	result := math.Exp(value)
	if math.IsInf(result, 0) {
		return 0, errors.New("exponential overflow")
	}
	return result, nil
}

// Exp10 calculates 10^x
func (s *ScientificOperations) Exp10(value float64) (float64, error) {
	result := math.Pow(10, value)
	if math.IsInf(result, 0) {
		return 0, errors.New("exponential overflow")
	}
	return result, nil
}

// Exp2 calculates 2^x
func (s *ScientificOperations) Exp2(value float64) (float64, error) {
	result := math.Exp2(value)
	if math.IsInf(result, 0) {
		return 0, errors.New("exponential overflow")
	}
	return result, nil
}

// Hyperbolic Functions

// Sinh calculates hyperbolic sine
func (s *ScientificOperations) Sinh(value float64) (float64, error) {
	result := math.Sinh(value)
	if math.IsInf(result, 0) {
		return 0, errors.New("hyperbolic sine overflow")
	}
	return result, nil
}

// Cosh calculates hyperbolic cosine
func (s *ScientificOperations) Cosh(value float64) (float64, error) {
	result := math.Cosh(value)
	if math.IsInf(result, 0) {
		return 0, errors.New("hyperbolic cosine overflow")
	}
	return result, nil
}

// Tanh calculates hyperbolic tangent
func (s *ScientificOperations) Tanh(value float64) float64 {
	return math.Tanh(value)
}

// Additional Functions

// Gamma calculates gamma function
func (s *ScientificOperations) Gamma(value float64) (float64, error) {
	result := math.Gamma(value)
	if math.IsNaN(result) || math.IsInf(result, 0) {
		return 0, errors.New("gamma function domain or overflow error")
	}
	return result, nil
}

// Floor returns the greatest integer less than or equal to value
func (s *ScientificOperations) Floor(value float64) float64 {
	return math.Floor(value)
}

// Ceil returns the least integer greater than or equal to value
func (s *ScientificOperations) Ceil(value float64) float64 {
	return math.Ceil(value)
}

// Round rounds to nearest integer
func (s *ScientificOperations) Round(value float64) float64 {
	return math.Round(value)
}