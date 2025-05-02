import express from 'express';
import scrapeRoutes from './interfaces/routes/scrape.routes';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import yaml from 'yamljs';

const app = express();

const swaggerPath = path.resolve(
  __dirname,
  'interfaces',
  'swagger',
  'swagger.yml'
);
const swaggerDocument = yaml.load(swaggerPath);

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/scrape', scrapeRoutes);

export default app;
