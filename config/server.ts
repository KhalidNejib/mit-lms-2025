import app from '../src/app'; 
import { PORT } from './enviroment';
import { connectDB } from './database';

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
