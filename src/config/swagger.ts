import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🩺 Medical Appointment System API Documentation",
      version: "1.0.0",
      description: "Comprehensive REST API for Patients, Doctors, and Admin scheduling & appointments.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts" , "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
