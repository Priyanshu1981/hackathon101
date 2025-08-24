import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { store } from '../store.ts';
import { PlotRecord } from '../types.ts';

export async function plotRoutes(app: FastifyInstance) {
  app.post('/plots', { preValidation: [app.authenticate] }, async (request, reply) => {
    const schema = z.object({
      geoJSON: z.any(),
      area: z.number().positive(),
      irrigation: z.enum(['rainfed', 'irrigated', 'unknown']).optional(),
    });
    const parse = schema.safeParse(request.body);
    if (!parse.success) {
      reply.code(400).send({ error: 'Invalid payload' });
      return;
    }
    const user = request.user;
    const plot: PlotRecord = {
      plotId: `p_${Math.random().toString(36).slice(2, 10)}`,
      userId: user.userId,
      ...parse.data,
      createdAt: new Date().toISOString(),
    };
    store.addPlot(plot);
    reply.code(201).send(plot);
  });

  app.get('/plots', { preValidation: [app.authenticate] }, async (request, reply) => {
    const user = request.user;
    reply.send(store.getPlots(user.userId));
  });
}