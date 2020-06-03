import express from "express";
import PointController from "../controllers/PointsController";

const pointController = new PointController();

const routes = express.Router();

routes.get("/", pointController.index);

routes.post("/", pointController.create);
routes.get("/:id", pointController.show);

export default routes;
