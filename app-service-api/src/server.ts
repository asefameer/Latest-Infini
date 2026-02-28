import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { catalogRouter } from './routes/catalog.js';
import { cmsRouter } from './routes/cms.js';
import { discountsRouter } from './routes/discounts.js';
import { eventsRouter } from './routes/events.js';
import { ordersRouter } from './routes/orders.js';
import { productsRouter } from './routes/products.js';
import { searchRouter } from './routes/search.js';
import { uploadsRouter } from './routes/uploads.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'infinity-app-service-api' });
});

app.use('/api/products', productsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/discounts', discountsRouter);
app.use('/api/search', searchRouter);
app.use('/api', catalogRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/uploads', uploadsRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: unknown, _req: Request, res: Response, _next: unknown) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Infinity App Service API listening on ${port}`);
});
