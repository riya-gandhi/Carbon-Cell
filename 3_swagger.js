const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path"); // Import the path module

const app = express();
const port = 3000;

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Your API Documentation",
      description: "Documentation for your API endpoints",
      version: "1.0.0",
    },
  },
  apis: [path.join(__dirname, "routes/*.js")], // Use path.join to construct the file path
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
