import express from 'express';
import scrapeRoutes from './interfaces/routes/scrape.routes';

export function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use('/api/scrape', scrapeRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
