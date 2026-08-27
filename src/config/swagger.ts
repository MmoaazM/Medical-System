import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🩺 Medical Appointment System API Documentation",
      version: "1.0.0",
      description: "Comprehensive REST API for Patients, Doctors, and Admin scheduling & appointments.",
      contact: {
        name: "Medical System API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "API Base URL (v1)",
      },
      {
        url: "http://localhost:3000",
        description: "Root Server URL",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication and user registration operations",
      },
      {
        name: "Doctors",
        description: "Doctor profile creation, updates, and lookups",
      },
      {
        name: "Schedules",
        description: "Doctor availability and scheduling management",
      },
      {
        name: "Appointments",
        description: "Patient appointment booking and lifecycle management",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT Bearer token to access secured endpoints.",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "Session cookie authentication with JWT token.",
        },
      },
      schemas: {
        // AUTH & USERS
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "64dfa5b12c98d7001a123400",
            },
            FullName: {
              type: "string",
              example: "Dr. Ahmed Ali",
            },
            Email: {
              type: "string",
              format: "email",
              example: "ahmed.ali@example.com",
            },
            Role: {
              type: "string",
              enum: ["Patient", "Doctor", "Admin"],
              example: "Doctor",
            },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["FullName", "Email", "Password", "Role"],
          properties: {
            FullName: {
              type: "string",
              example: "Dr. Ahmed Ali",
            },
            Email: {
              type: "string",
              format: "email",
              example: "ahmed.ali@example.com",
            },
            Password: {
              type: "string",
              format: "password",
              example: "SecurePass123!",
            },
            Role: {
              type: "string",
              enum: ["Patient", "Doctor", "Admin"],
              example: "Doctor",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["Email", "Password"],
          properties: {
            Email: {
              type: "string",
              format: "email",
              example: "ahmed.ali@example.com",
            },
            Password: {
              type: "string",
              format: "password",
              example: "SecurePass123!",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Logged in successfully",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        // DOCTOR PROFILES
        DoctorProfile: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64dfa5b12c98d7001a123400",
            },
            user: {
              type: "string",
              description: "Associated User ID",
              example: "64dfa5b12c98d7001a123400",
            },
            specialty: {
              type: "string",
              example: "Cardiology",
            },
            experience: {
              type: "number",
              description: "Years of experience",
              example: 8,
            },
            clinicAddress: {
              type: "string",
              example: "123 Medical Tower, Cairo, Egypt",
            },
            consultationFee: {
              type: "number",
              example: 400,
            },
            workingHours: {
              type: "string",
              example: "09:00 AM - 05:00 PM",
            },
            availabilityStatus: {
              type: "boolean",
              example: true,
            },
          },
        },
        CreateDoctorInput: {
          type: "object",
          required: [
            "user",
            "specialty",
            "experience",
            "clinicAddress",
            "consultationFee",
            "workingHours",
          ],
          properties: {
            user: {
              type: "string",
              description: "User ID with Doctor role",
              example: "64dfa5b12c98d7001a123400",
            },
            specialty: {
              type: "string",
              example: "Cardiology",
            },
            experience: {
              type: "number",
              example: 8,
            },
            clinicAddress: {
              type: "string",
              example: "123 Medical Tower, Cairo, Egypt",
            },
            consultationFee: {
              type: "number",
              example: 400,
            },
            workingHours: {
              type: "string",
              example: "09:00 AM - 05:00 PM",
            },
            availabilityStatus: {
              type: "boolean",
              example: true,
            },
          },
        },
        UpdateDoctorInput: {
          type: "object",
          properties: {
            specialty: {
              type: "string",
              example: "Interventional Cardiology",
            },
            experience: {
              type: "number",
              example: 9,
            },
            clinicAddress: {
              type: "string",
              example: "456 Health Plaza, Giza, Egypt",
            },
            consultationFee: {
              type: "number",
              example: 500,
            },
            workingHours: {
              type: "string",
              example: "10:00 AM - 06:00 PM",
            },
            availabilityStatus: {
              type: "boolean",
              example: true,
            },
          },
        },

        // SCHEDULES
        Schedule: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64dfa5b12c98d7001a123499",
            },
            doctor: {
              type: "string",
              description: "Doctor Profile ID",
              example: "64dfa5b12c98d7001a123400",
            },
            day: {
              type: "string",
              example: "Monday",
            },
            availableTimeSlots: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["09:00 - 09:30", "10:00 - 10:30", "11:00 - 11:30"],
            },
            availability: {
              type: "boolean",
              example: true,
            },
          },
        },
        CreateScheduleInput: {
          type: "object",
          required: ["doctor", "day", "availableTimeSlots", "availability"],
          properties: {
            doctor: {
              type: "string",
              example: "64dfa5b12c98d7001a123400",
            },
            day: {
              type: "string",
              example: "Monday",
            },
            availableTimeSlots: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["09:00 - 09:30", "10:00 - 10:30"],
            },
            availability: {
              type: "boolean",
              example: true,
            },
          },
        },
        UpdateScheduleInput: {
          type: "object",
          properties: {
            day: {
              type: "string",
              example: "Tuesday",
            },
            availableTimeSlots: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["10:00 - 10:30", "11:00 - 11:30"],
            },
            availability: {
              type: "boolean",
              example: true,
            },
          },
        },

        // APPOINTMENTS
        AppointmentTimeSlot: {
          type: "object",
          required: ["startTime", "endTime"],
          properties: {
            startTime: {
              type: "string",
              example: "09:00",
            },
            endTime: {
              type: "string",
              example: "09:30",
            },
          },
        },
        Appointment: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64dfa5b12c98d7001a999999",
            },
            doctor: {
              type: "string",
              description: "Doctor User ID",
              example: "64dfa5b12c98d7001a123400",
            },
            patient: {
              type: "string",
              description: "Patient User ID",
              example: "64dfa5b12c98d7001a123401",
            },
            schedule: {
              type: "string",
              description: "Associated Schedule ID",
              example: "64dfa5b12c98d7001a123499",
            },
            appointmentDate: {
              type: "string",
              example: "2026-09-01",
            },
            timeSlot: {
              $ref: "#/components/schemas/AppointmentTimeSlot",
            },
            status: {
              type: "string",
              enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
              example: "Pending",
            },
            notes: {
              type: "string",
              example: "Regular check-up consultation",
            },
          },
        },
        CreateAppointmentInput: {
          type: "object",
          required: ["doctorId", "patientId", "appointmentDate", "timeSlot"],
          properties: {
            doctorId: {
              type: "string",
              example: "64dfa5b12c98d7001a123400",
            },
            patientId: {
              type: "string",
              example: "64dfa5b12c98d7001a123401",
            },
            appointmentDate: {
              type: "string",
              example: "2026-09-01",
            },
            timeSlot: {
              $ref: "#/components/schemas/AppointmentTimeSlot",
            },
            notes: {
              type: "string",
              example: "Regular check-up",
            },
          },
        },

        // SHARED RESPONSES
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error description",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        SuccessMessageResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
          },
        },
      },
    },
    paths: {
      // AUTH ENDPOINTS
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user (Patient, Doctor, Admin)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterInput",
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "User registered successfully" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            400: {
              description: "Bad Request - Missing fields or duplicate email",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Logged in successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            400: {
              description: "Invalid email or password",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      // DOCTOR ENDPOINTS
      "/doctors": {
        get: {
          tags: ["Doctors"],
          summary: "Get all doctor profiles",
          responses: {
            200: {
              description: "List of doctor profiles",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/DoctorProfile" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Doctors"],
          summary: "Create a new doctor profile (Admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateDoctorInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Doctor created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessMessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Requires Admin role" },
          },
        },
      },
      "/doctors/{id}": {
        get: {
          tags: ["Doctors"],
          summary: "Get doctor profile by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Doctor Profile ID",
            },
          ],
          responses: {
            200: {
              description: "Doctor profile details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DoctorProfile" },
                },
              },
            },
            404: { description: "Doctor not found" },
          },
        },
        patch: {
          tags: ["Doctors"],
          summary: "Update doctor profile (Admin / Doctor)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Doctor Profile ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateDoctorInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Doctor updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessMessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Doctor not found" },
          },
        },
        delete: {
          tags: ["Doctors"],
          summary: "Delete doctor profile (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Doctor Profile ID",
            },
          ],
          responses: {
            200: {
              description: "Doctor deleted successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessMessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Requires Admin role" },
            404: { description: "Doctor not found" },
          },
        },
      },

      // SCHEDULE ENDPOINTS
      "/schedules": {
        get: {
          tags: ["Schedules"],
          summary: "Get all schedules",
          responses: {
            200: {
              description: "List of all schedules",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Schedule" },
                  },
                },
              },
            },
          },
        },
      },
      "/schedules/{id}": {
        post: {
          tags: ["Schedules"],
          summary: "Create schedule for a doctor (Doctor role only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Doctor ID or Schedule Identifier",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateScheduleInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Schedule created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessMessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
          },
        },
        patch: {
          tags: ["Schedules"],
          summary: "Update schedule by ID (Doctor role only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Schedule ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateScheduleInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Schedule updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessMessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Schedule not found" },
          },
        },
        delete: {
          tags: ["Schedules"],
          summary: "Delete schedule by ID (Doctor role only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Schedule ID",
            },
          ],
          responses: {
            200: {
              description: "Schedule deleted successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SuccessMessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden" },
            404: { description: "Schedule not found" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);