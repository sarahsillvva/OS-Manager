export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Gestão de OS - Auth Service",
    description: "Documentação do serviço de autenticação e usuários",
    version: "1.0.0",
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Registra um novo usuário/técnico",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string", example: "technician" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Usuário criado com sucesso" },
          400: { description: "Usuário já existe" }
        }
      }
    },
    "/auth/login": {
        post: {
            summary: "Autentica um usuário e retorna um token JWT",
            tags: ["Auth"],
            requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: { type: "string" },
                            password: { type: "string" }
                        }
                    }
                }
            }
            },
            responses: {
                200: { description: "Login realizado com sucesso" },
                401: { description: "Credenciais inválidas" }
            }
        }
        }
  }
};