import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import routes from './routes';
import config from './config';
import errorHandler from './middlewares/errorHandler';

const app = express();
const port = config.port;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Trust the first proxy if behind one (helps with getting correct IP addresses)
app.set('trust proxy', 1);

// Middleware for request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use(routes);

// Handle 404 - Route Not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.url} not found` 
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Express server is listening at http://localhost:${port}`);
  console.log(`Environment: ${config.environment}`);
});
