import { Router } from 'express';
import MetricsController from '../controllers/MetricsController';

const metricsRouter = Router();
const metricsController = new MetricsController();

metricsRouter.get('/', metricsController.index);

export default metricsRouter;