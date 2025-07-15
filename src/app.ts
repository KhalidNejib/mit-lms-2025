import express, { Request, Response, NextFunction } from 'express';
import courseRoutes from './routes/course.routes';

const app = express();

app.use(express.json());
app.use('/api/courses', courseRoutes);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
