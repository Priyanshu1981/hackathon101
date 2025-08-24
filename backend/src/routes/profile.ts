import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { store } from '../store.ts';
import { UserProfile } from '../types.ts';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/me', { preValidation: [app.authenticate] }, async (request, reply) => {
    const user = request.user;
    const profile = store.getProfile(user.userId);
    reply.send(profile);
  });

  app.put('/me', { preValidation: [app.authenticate] }, async (request, reply) => {
    const schema = z.object({
      name: z.string().min(1).max(120).optional(),
      language: z.string().min(2).max(5).optional(),
      prefs: z
        .object({
          audioFirst: z.boolean().optional(),
        })
        .partial()
        .optional(),
    });
    const parse = schema.safeParse(request.body);
    if (!parse.success) {
      reply.code(400).send({ error: 'Invalid payload' });
      return;
    }
    const user = request.user;
    const existing = store.getProfile(user.userId);
    const next: UserProfile = {
      userId: user.userId,
      phone: user.phone,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      ...existing,
      ...parse.data,
    } as UserProfile;
    store.upsertProfile(next);
    reply.send(next);
  });
}