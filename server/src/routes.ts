import express from 'express';
import PoinsController from './controller/PointsController';
import ItemsController from './controller/ItemsController';
const routes = express.Router();

const pointsController = new PoinsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);
routes.post("/points", pointsController.create);
routes.get("/points", pointsController.index);
routes.get("/points/:id", pointsController.show);

export default routes;
