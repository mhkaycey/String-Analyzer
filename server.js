import express from "express";
import logger  from'morgan';
import { SERVER_URL, PORT } from './config.js';



const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
import stringRouter from './routes/string.route.js';

app.use('/strings', stringRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
//   console.log(`Profile endpoint available at: ${SERVER_URL}${PORT}/me`);
  console.log(`Health check at: ${SERVER_URL}${PORT}/health`);
});


export default app;
