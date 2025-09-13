package main

import (
	"calculator-backend/handlers"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Create Gin router
	router := gin.Default()

	// Configure CORS
	config := cors.Config{
		AllowOrigins:     []string{"*"}, // In production, specify exact origins
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(config))

	// Create calculator handler
	calculatorHandler := handlers.NewCalculatorHandler()

	// API routes
	api := router.Group("/api")
	{
		// Health check
		api.GET("/health", calculatorHandler.HealthCheck)
		
		// Calculator operations
		api.POST("/calculate", calculatorHandler.EvaluateExpression)
		api.POST("/basic", calculatorHandler.BasicOperation)
		api.POST("/scientific", calculatorHandler.ScientificOperation)
		
		// Utility endpoints
		api.GET("/constants", calculatorHandler.GetConstants)
		api.GET("/convert-angle", calculatorHandler.ConvertAngle)
	}

	// Root endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message":     "Scientific Calculator API",
			"version":     "1.0.0",
			"description": "A powerful scientific calculator API built with Go",
			"endpoints": gin.H{
				"health":       "/api/health",
				"calculate":    "POST /api/calculate",
				"basic":        "POST /api/basic",
				"scientific":   "POST /api/scientific",
				"constants":    "/api/constants",
				"convertAngle": "/api/convert-angle",
			},
		})
	})

	// Start server
	port := "8080"
	log.Printf("Starting Scientific Calculator API server on port %s", port)
	log.Printf("Server running at http://localhost:%s", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}