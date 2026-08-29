const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "transport-app API",
      version: "1.0.0",
      description:
        "REST API for the transport-app MERN application. Provides user and captain " +
        "authentication (register / login / profile / logout). All protected endpoints " +
        "require a valid JWT sent either as a Bearer token in the `Authorization` header " +
        "or in the `token` httpOnly cookie.",
    },
    servers: [{ url: "http://localhost:3000", description: "Local server" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT obtained from register/login. Provide as `Authorization: Bearer <token>`.",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT stored in the `token` httpOnly cookie set on register/login.",
        },
      },
      schemas: {
        FullName: {
          type: "object",
          required: ["firstName"],
          properties: {
            firstName: { type: "string", example: "John", minLength: 3, maxLength: 50 },
            lastName: { type: "string", example: "Doe", minLength: 3, maxLength: 50 },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            fullname: { $ref: "#/components/schemas/FullName" },
            email: { type: "string", format: "email", example: "john@example.com" },
            phone: { type: "string", example: "+14155550101" },
            profileImage: { type: "string", nullable: true, example: null },
            role: { type: "string", enum: ["user"], example: "user" },
            isVerified: { type: "boolean", example: false },
            isActive: { type: "boolean", example: true },
            location: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["Point"], example: "Point" },
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                  example: [0, 0],
                },
              },
            },
            socketId: { type: "string", nullable: true, example: null },
            lastLoginAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Captain: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
            fullname: { $ref: "#/components/schemas/FullName" },
            email: { type: "string", format: "email", example: "captain@example.com" },
            phone: { type: "string", example: "+14155550102" },
            profileImage: { type: "string", nullable: true, example: null },
            role: { type: "string", enum: ["captain"], example: "captain" },
            isVerified: { type: "boolean", example: false },
            isActive: { type: "boolean", example: true },
            isOnline: { type: "boolean", example: false },
            isAvailable: { type: "boolean", example: false },
            license: {
              type: "object",
              properties: {
                number: { type: "string", example: "DL-12345678" },
                expiryDate: { type: "string", format: "date", example: "2026-12-31" },
                document: { type: "string", nullable: true, example: null },
              },
            },
            vehicle: {
              type: "object",
              properties: {
                vehicleType: {
                  type: "string",
                  enum: ["bike", "rickshaw", "car", "premium", "go", "go_mini", "go_sedan"],
                  example: "car",
                },
                make: { type: "string", example: "Toyota" },
                model: { type: "string", example: "Corolla" },
                year: { type: "number", example: 2020 },
                color: { type: "string", example: "Black" },
                plateNumber: { type: "string", example: "ABC-1234" },
                registrationNumber: { type: "string", nullable: true, example: null },
                image: { type: "string", nullable: true, example: null },
              },
            },
            rating: {
              type: "object",
              properties: {
                average: { type: "number", example: 5 },
                totalRatings: { type: "number", example: 0 },
              },
            },
            totalTrips: { type: "number", example: 0 },
            completedTrips: { type: "number", example: 0 },
            cancelledTrips: { type: "number", example: 0 },
            location: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["Point"], example: "Point" },
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                  example: [0, 0],
                },
              },
            },
            socketId: { type: "string", nullable: true, example: null },
            lastLocationUpdate: { type: "string", format: "date-time", nullable: true },
            lastLoginAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserRegister: {
          type: "object",
          required: ["fullname", "email", "phone", "password"],
          properties: {
            fullname: {
              type: "object",
              required: ["firstName"],
              properties: {
                firstName: { type: "string", example: "John", minLength: 3, maxLength: 50 },
                lastName: { type: "string", example: "Doe", minLength: 3, maxLength: 50 },
              },
            },
            email: { type: "string", format: "email", example: "john@example.com" },
            phone: { type: "string", example: "+14155550101" },
            password: { type: "string", format: "password", example: "secret123", minLength: 6 },
          },
        },
        CaptainRegister: {
          type: "object",
          required: ["fullname", "email", "phone", "password", "vehicle", "license"],
          properties: {
            fullname: {
              type: "object",
              required: ["firstName", "lastName"],
              properties: {
                firstName: { type: "string", example: "James", minLength: 2, maxLength: 50 },
                lastName: { type: "string", example: "Smith", minLength: 2, maxLength: 50 },
              },
            },
            email: { type: "string", format: "email", example: "captain@example.com" },
            phone: { type: "string", example: "+14155550102" },
            password: { type: "string", format: "password", example: "secret123", minLength: 6 },
            vehicle: {
              type: "object",
              required: ["vehicleType", "make", "model", "year", "color", "plateNumber"],
              properties: {
                vehicleType: {
                  type: "string",
                  enum: ["bike", "rickshaw", "car", "premium", "go", "go_mini", "go_sedan"],
                  example: "car",
                },
                make: { type: "string", example: "Toyota" },
                model: { type: "string", example: "Corolla" },
                year: { type: "number", example: 2020, minimum: 1886 },
                color: { type: "string", example: "Black" },
                plateNumber: { type: "string", example: "ABC-1234", minLength: 3, maxLength: 15 },
              },
            },
            license: {
              type: "object",
              required: ["number", "expiryDate"],
              properties: {
                number: { type: "string", example: "DL-12345678", minLength: 5, maxLength: 30 },
                expiryDate: { type: "string", format: "date", example: "2026-12-31" },
              },
            },
          },
        },
        Login: {
          type: "object",
          required: ["password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
              description: "Either email or phone must be provided.",
            },
            phone: {
              type: "string",
              example: "+14155550101",
              description: "Alternative to email.",
            },
            password: { type: "string", format: "password", example: "secret123", minLength: 6 },
          },
          description: "Login with an email address OR a phone number (at least one required) plus a password.",
        },
        TokenResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "JWT. Also set as the `token` httpOnly cookie.",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        UserTokenResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        CaptainTokenResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            captain: { $ref: "#/components/schemas/Captain" },
          },
        },
        Message: {
          type: "object",
          properties: {
            message: { type: "string", example: "Logged out successfully" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  value: { type: "string" },
                  msg: { type: "string" },
                  path: { type: "string" },
                  location: { type: "string" },
                },
              },
            },
          },
        },
        Error401: {
          type: "object",
          properties: {
            message: { type: "string", example: "Unauthorized." },
          },
        },
        Error404: {
          type: "object",
          properties: {
            message: { type: "string", example: "User not found" },
          },
        },
        Error409: {
          type: "object",
          properties: {
            message: { type: "string", example: "An account with this email already exists" },
          },
        },
      },
    },
    tags: [
      { name: "Users", description: "User registration and authentication" },
      { name: "Captains", description: "Captain registration and authentication" },
      { name: "Health", description: "Server health check" },
    ],
    paths: {
      "/": {
        get: {
          tags: ["Health"],
          summary: "Server health check",
          responses: {
            200: {
              description: "Server is running",
              content: {
                "text/plain": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/users/register": {
        post: {
          tags: ["Users"],
          summary: "Register a new user",
          description:
            "Creates a user account, returns a JWT, and sets the `token` httpOnly cookie (24h).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserRegister" },
              },
            },
          },
          responses: {
            201: {
              description: "User created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserTokenResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
            409: {
              description: "Duplicate email or phone",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error409" },
                },
              },
            },
            429: { description: "Too many requests (rate limited)" },
          },
        },
      },
      "/users/login": {
        post: {
          tags: ["Users"],
          summary: "Login as a user",
          description:
            "Authenticates a user by email OR phone + password, returns a JWT, and sets the `token` httpOnly cookie (24h).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Login" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserTokenResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
            401: {
              description: "Invalid email or password",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error401" },
                },
              },
            },
            429: { description: "Too many requests (rate limited)" },
          },
        },
      },
      "/users/profile": {
        get: {
          tags: ["Users"],
          summary: "Get the authenticated user's profile",
          description:
            "Requires a valid JWT (Bearer header or `token` cookie). Returns the fresh user document.",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: "User profile",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error401" },
                },
              },
            },
            404: {
              description: "User not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error404" },
                },
              },
            },
          },
        },
      },
      "/users/logout": {
        get: {
          tags: ["Users"],
          summary: "Log out the authenticated user",
          description:
            "Requires a valid JWT. Blacklists the token (24h TTL) and clears the auth cookie.",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: "Logged out",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Message" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error401" },
                },
              },
            },
          },
        },
      },
      "/captains/register": {
        post: {
          tags: ["Captains"],
          summary: "Register a new captain",
          description:
            "Creates a captain account with vehicle and license details, returns a JWT, and sets the `token` httpOnly cookie (24h).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CaptainRegister" },
              },
            },
          },
          responses: {
            201: {
              description: "Captain created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CaptainTokenResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
            409: {
              description: "Duplicate email, phone, license, or plate number",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error409" },
                },
              },
            },
            429: { description: "Too many requests (rate limited)" },
          },
        },
      },
      "/captains/login": {
        post: {
          tags: ["Captains"],
          summary: "Login as a captain",
          description:
            "Authenticates a captain by email OR phone + password, returns a JWT, and sets the `token` httpOnly cookie (24h).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Login" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CaptainTokenResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
            401: {
              description: "Invalid email or password",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error401" },
                },
              },
            },
            429: { description: "Too many requests (rate limited)" },
          },
        },
      },
      "/captains/profile": {
        get: {
          tags: ["Captains"],
          summary: "Get the authenticated captain's profile",
          description:
            "Requires a valid JWT (Bearer header or `token` cookie). Returns the fresh captain document.",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: "Captain profile",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Captain" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error401" },
                },
              },
            },
            404: {
              description: "Captain not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error404" },
                },
              },
            },
          },
        },
      },
      "/captains/logout": {
        get: {
          tags: ["Captains"],
          summary: "Log out the authenticated captain",
          description:
            "Requires a valid JWT. Blacklists the token (24h TTL) and clears the auth cookie.",
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: "Logged out",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Message" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error401" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
