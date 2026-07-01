import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LeetLab API Docs",
      version: "1.0.0",
      description:
        "Comprehensive REST API documentation for the LeetLab competitive coding platform, covering authentication, problems, compilers, playlists, leaderboard, and AI helpers.",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
        description: "Development Server",
      },
      {
        url: "https://leet-lab-amarnath-kumar.onrender.com/api/v1",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
          description:
            "Cookie-based JWT token authentication (httpOnly secure cookie named 'jwt')",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/index.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
