import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './plugins/auth.ts';
import { authRoutes } from './routes/auth.ts';
import { profileRoutes } from './routes/profile.ts';
import { plotRoutes } from './routes/plots.ts';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true, credentials: true });
await app.register(authPlugin);

app.get('/health', async () => ({ ok: true }));

await app.register(async (instance) => {
  await authRoutes(instance);
  await profileRoutes(instance);
  await plotRoutes(instance);
});

const port = Number(process.env.PORT || 3000);
const host = '0.0.0.0';

try {
  await app.listen({ port, host });
  app.log.info(`Server listening on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}