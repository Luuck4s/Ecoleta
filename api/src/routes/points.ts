import express from "express";
import { celebrate, Joi } from "celebrate";

import multer from "multer";
import multerConfig from "../config/multer";

import PointController from "../controllers/PointsController";

const pointController = new PointController();

const routes = express.Router();
const upload = multer(multerConfig);

routes.get("/", pointController.index);

routes.post(
  "/",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointController.create
);
routes.get("/:id", pointController.show);

export default routes;
