package calculator

import (
	"errors"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

// ExpressionParser handles parsing and evaluating mathematical expressions
type ExpressionParser struct {
	basic      *BasicOperations
	scientific *ScientificOperations
	isDegree   bool
}

// NewExpressionParser creates a new ExpressionParser
func NewExpressionParser() *ExpressionParser {
	return &ExpressionParser{
		basic:      NewBasicOperations(),
		scientific: NewScientificOperations(),
		isDegree:   true, // Default to degree mode
	}
}

// SetMode sets the angle mode for trigonometric functions
func (p *ExpressionParser) SetMode(isDegree bool) {
	p.isDegree = isDegree
}

// Evaluate parses and evaluates a mathematical expression
func (p *ExpressionParser) Evaluate(expression string) (float64, error) {
	// Clean the expression
	expression = p.cleanExpression(expression)
	
	// Replace constants
	expression = p.replaceConstants(expression)
	
	// Handle scientific functions
	var err error
	expression, err = p.evaluateScientificFunctions(expression)
	if err != nil {
		return 0, err
	}
	
	// Evaluate the remaining arithmetic expression
	return p.evaluateArithmetic(expression)
}

// cleanExpression removes whitespace and standardizes operators
func (p *ExpressionParser) cleanExpression(expr string) string {
	// Remove all whitespace
	expr = regexp.MustCompile(`\s+`).ReplaceAllString(expr, "")
	
	// Replace common operator variations
	expr = strings.ReplaceAll(expr, "×", "*")
	expr = strings.ReplaceAll(expr, "÷", "/")
	expr = strings.ReplaceAll(expr, "−", "-")
	
	// Handle implicit multiplication (e.g., 2π → 2*π)
	expr = regexp.MustCompile(`(\d)([a-zA-Z])`).ReplaceAllString(expr, "$1*$2")
	expr = regexp.MustCompile(`([a-zA-Z])(\d)`).ReplaceAllString(expr, "$1*$2")
	expr = regexp.MustCompile(`(\))(\()`).ReplaceAllString(expr, "$1*$2")
	expr = regexp.MustCompile(`(\d)(\()`).ReplaceAllString(expr, "$1*$2")
	expr = regexp.MustCompile(`(\))(\d)`).ReplaceAllString(expr, "$1*$2")
	
	return expr
}

// replaceConstants replaces mathematical constants with their values
func (p *ExpressionParser) replaceConstants(expr string) string {
	expr = strings.ReplaceAll(expr, "π", fmt.Sprintf("%g", math.Pi))
	expr = strings.ReplaceAll(expr, "pi", fmt.Sprintf("%g", math.Pi))
	expr = strings.ReplaceAll(expr, "e", fmt.Sprintf("%g", math.E))
	return expr
}

// evaluateScientificFunctions evaluates scientific functions in the expression
func (p *ExpressionParser) evaluateScientificFunctions(expr string) (string, error) {
	// Define function patterns with their evaluation logic
	functions := map[string]func(float64) (float64, error){
		"sin": func(x float64) (float64, error) {
			return p.scientific.Sin(x, p.isDegree), nil
		},
		"cos": func(x float64) (float64, error) {
			return p.scientific.Cos(x, p.isDegree), nil
		},
		"tan": func(x float64) (float64, error) {
			return p.scientific.Tan(x, p.isDegree)
		},
		"asin": func(x float64) (float64, error) {
			return p.scientific.Asin(x, p.isDegree)
		},
		"acos": func(x float64) (float64, error) {
			return p.scientific.Acos(x, p.isDegree)
		},
		"atan": func(x float64) (float64, error) {
			return p.scientific.Atan(x, p.isDegree), nil
		},
		"log": func(x float64) (float64, error) {
			return p.scientific.Log(x)
		},
		"ln": func(x float64) (float64, error) {
			return p.scientific.Ln(x)
		},
		"exp": func(x float64) (float64, error) {
			return p.scientific.Exp(x)
		},
		"sqrt": func(x float64) (float64, error) {
			return p.basic.SquareRoot(x)
		},
		"abs": func(x float64) (float64, error) {
			return p.basic.Absolute(x), nil
		},
		"floor": func(x float64) (float64, error) {
			return p.scientific.Floor(x), nil
		},
		"ceil": func(x float64) (float64, error) {
			return p.scientific.Ceil(x), nil
		},
		"round": func(x float64) (float64, error) {
			return p.scientific.Round(x), nil
		},
	}
	
	// Process each function
	for funcName, funcEval := range functions {
		pattern := fmt.Sprintf(`%s\(([^()]+)\)`, funcName)
		re := regexp.MustCompile(pattern)
		
		for re.MatchString(expr) {
			matches := re.FindStringSubmatch(expr)
			if len(matches) < 2 {
				continue
			}
			
			// Recursively evaluate the argument
			argValue, err := p.evaluateArithmetic(matches[1])
			if err != nil {
				return "", fmt.Errorf("error in %s function argument: %v", funcName, err)
			}
			
			// Apply the function
			result, err := funcEval(argValue)
			if err != nil {
				return "", fmt.Errorf("error in %s function: %v", funcName, err)
			}
			
			// Replace the function call with its result
			expr = strings.Replace(expr, matches[0], fmt.Sprintf("%g", result), 1)
		}
	}
	
	// Handle factorial separately (postfix operator)
	factorialPattern := `(\d+(?:\.\d+)?)!`
	factorialRe := regexp.MustCompile(factorialPattern)
	for factorialRe.MatchString(expr) {
		matches := factorialRe.FindStringSubmatch(expr)
		if len(matches) < 2 {
			continue
		}
		
		value, err := strconv.ParseFloat(matches[1], 64)
		if err != nil {
			return "", fmt.Errorf("invalid number for factorial: %s", matches[1])
		}
		
		result, err := p.basic.Factorial(value)
		if err != nil {
			return "", fmt.Errorf("factorial error: %v", err)
		}
		
		expr = strings.Replace(expr, matches[0], fmt.Sprintf("%g", result), 1)
	}
	
	return expr, nil
}

// evaluateArithmetic evaluates basic arithmetic expressions using recursive descent
func (p *ExpressionParser) evaluateArithmetic(expr string) (float64, error) {
	if expr == "" {
		return 0, errors.New("empty expression")
	}
	
	// Handle parentheses first
	for strings.Contains(expr, "(") {
		// Find the innermost parentheses
		start := -1
		for i, char := range expr {
			if char == '(' {
				start = i
			} else if char == ')' && start != -1 {
				// Evaluate the expression inside parentheses
				inner := expr[start+1 : i]
				result, err := p.evaluateArithmetic(inner)
				if err != nil {
					return 0, err
				}
				
				// Replace the parenthetical expression with its result
				expr = expr[:start] + fmt.Sprintf("%g", result) + expr[i+1:]
				break
			}
		}
		
		// If we couldn't find matching parentheses, return error
		if start != -1 && !strings.Contains(expr[start:], ")") {
			return 0, errors.New("mismatched parentheses")
		}
	}
	
	// Now evaluate the expression without parentheses
	return p.evaluateSimpleExpression(expr)
}

// evaluateSimpleExpression evaluates expressions without parentheses using operator precedence
func (p *ExpressionParser) evaluateSimpleExpression(expr string) (float64, error) {
	// Handle power operations first (highest precedence)
	expr, err := p.evaluatePowerOperations(expr)
	if err != nil {
		return 0, err
	}
	
	// Handle multiplication and division (left to right)
	expr, err = p.evaluateMultiplicationDivision(expr)
	if err != nil {
		return 0, err
	}
	
	// Handle addition and subtraction (left to right)
	return p.evaluateAdditionSubtraction(expr)
}

// evaluatePowerOperations handles ^ and ** operators
func (p *ExpressionParser) evaluatePowerOperations(expr string) (string, error) {
	powerPattern := `(-?\d+(?:\.\d+)?)(\^|\*\*)(-?\d+(?:\.\d+)?)`
	powerRe := regexp.MustCompile(powerPattern)
	
	for powerRe.MatchString(expr) {
		matches := powerRe.FindStringSubmatch(expr)
		if len(matches) < 4 {
			continue
		}
		
		base, err := strconv.ParseFloat(matches[1], 64)
		if err != nil {
			return "", fmt.Errorf("invalid base for power operation: %s", matches[1])
		}
		
		exponent, err := strconv.ParseFloat(matches[3], 64)
		if err != nil {
			return "", fmt.Errorf("invalid exponent for power operation: %s", matches[3])
		}
		
		result, err := p.basic.Power(base, exponent)
		if err != nil {
			return "", err
		}
		
		expr = strings.Replace(expr, matches[0], fmt.Sprintf("%g", result), 1)
	}
	
	return expr, nil
}

// evaluateMultiplicationDivision handles * and / operators
func (p *ExpressionParser) evaluateMultiplicationDivision(expr string) (string, error) {
	mdPattern := `(-?\d+(?:\.\d+)?)([*/])(-?\d+(?:\.\d+)?)`
	mdRe := regexp.MustCompile(mdPattern)
	
	for mdRe.MatchString(expr) {
		matches := mdRe.FindStringSubmatch(expr)
		if len(matches) < 4 {
			continue
		}
		
		left, err := strconv.ParseFloat(matches[1], 64)
		if err != nil {
			return "", fmt.Errorf("invalid left operand: %s", matches[1])
		}
		
		right, err := strconv.ParseFloat(matches[3], 64)
		if err != nil {
			return "", fmt.Errorf("invalid right operand: %s", matches[3])
		}
		
		var result float64
		if matches[2] == "*" {
			result = p.basic.Multiply(left, right)
		} else { // matches[2] == "/"
			result, err = p.basic.Divide(left, right)
			if err != nil {
				return "", err
			}
		}
		
		expr = strings.Replace(expr, matches[0], fmt.Sprintf("%g", result), 1)
	}
	
	return expr, nil
}

// evaluateAdditionSubtraction handles + and - operators
func (p *ExpressionParser) evaluateAdditionSubtraction(expr string) (float64, error) {
	// Split by + and - operators while preserving the operators
	parts := regexp.MustCompile(`([+-])`).Split(expr, -1)
	operators := regexp.MustCompile(`([+-])`).FindAllString(expr, -1)
	
	if len(parts) == 0 {
		return 0, errors.New("invalid expression")
	}
	
	// Parse the first number
	result, err := strconv.ParseFloat(parts[0], 64)
	if err != nil {
		return 0, fmt.Errorf("invalid number: %s", parts[0])
	}
	
	// Apply subsequent operations
	for i, op := range operators {
		if i+1 >= len(parts) {
			break
		}
		
		operand, err := strconv.ParseFloat(parts[i+1], 64)
		if err != nil {
			return 0, fmt.Errorf("invalid operand: %s", parts[i+1])
		}
		
		if op == "+" {
			result = p.basic.Add(result, operand)
		} else { // op == "-"
			result = p.basic.Subtract(result, operand)
		}
	}
	
	return result, nil
}