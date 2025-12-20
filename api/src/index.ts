import express from 'express';
import cors from 'cors';
import { db } from './config/index';
import setupAdminRoutes from './routes/admins';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import setupPositionRoutes from './routes/positions';

const app = express();
const PORT = 8080;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Markoub Jobs API',
      version: '1.0.0',
      description: 'API documentation for Markoub Jobs platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));


// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', async (_req, res) => {
  try {
    await db.execute('select 1');
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: 'db not ready' });
  }
});

// All the app routes setup
app.use(setupAdminRoutes);
app.use(setupPositionRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
