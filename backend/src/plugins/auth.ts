import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

export interface JwtUser {
  userId: string;
  phone: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
  interface FastifyRequest {
    user: JwtUser;
  }
}

const authPlugin: FastifyPluginAsync = fp(async (app: FastifyInstance) => {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  app.register(jwt, { secret });

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
});

export default authPlugin;