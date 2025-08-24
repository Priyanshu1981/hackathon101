import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { store } from '../store.ts';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/otp/request', async (request, reply) => {
    const schema = z.object({ phone: z.string().min(8).max(16) });
    const parse = schema.safeParse(request.body);
    if (!parse.success) {
      reply.code(400).send({ error: 'Invalid phone' });
      return;
    }
    const { phone } = parse.data;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    store.setOtp(phone, code, 5 * 60 * 1000);
    // In real implementation, send via SMS provider. Here we return masked info.
    const masked = phone.replace(/.(?=.{4})/g, '•');
    reply.send({ sent: true, maskedPhone: masked });
  });

  app.post('/auth/otp/verify', async (request, reply) => {
    const schema = z.object({ phone: z.string().min(8).max(16), code: z.string().length(6) });
    const parse = schema.safeParse(request.body);
    if (!parse.success) {
      reply.code(400).send({ error: 'Invalid payload' });
      return;
    }
    const { phone, code } = parse.data;
    const ok = store.verifyOtp(phone, code);
    if (!ok) {
      reply.code(401).send({ error: 'Invalid or expired code' });
      return;
    }
    const userId = store.getOrCreateUserIdByPhone(phone);
    const token = app.jwt.sign({ userId, phone }, { expiresIn: '30d' });
    reply.send({ jwt: token, userId });
  });
}