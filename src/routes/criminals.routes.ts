import { Router } from "express";
import { CreateCriminalsMiddleware } from "../middlewares/criminals/create.criminals.middlewares";
import { CriminalsController } from "../controllers/criminals.controller";
import { UpdateCriminalsMiddleware } from "../middlewares/criminals/update.criminals.middlewares";
import { DeleteCriminalsMiddleware } from "../middlewares/criminals/delete.criminals.middleware";
import { showCriminalsMiddleware } from "../middlewares/criminals/show.criminals.middlewares";

export class criminalsRoutes {
  public static execute(): Router {
    const router = Router();

    // definição de rotas para criminals:

    router.post(
      "/",
      [CreateCriminalsMiddleware.validate],
      CriminalsController.create
    );
    router.get("/", CriminalsController.list);
    router.get(
      "/:criminalId",
      [showCriminalsMiddleware.validate],
      CriminalsController.get
    );
    router.put(
      "/:criminalId",
      [UpdateCriminalsMiddleware.validate],
      CriminalsController.put
    );
    router.delete(
      "/:criminalId",
      [DeleteCriminalsMiddleware.validate],
      CriminalsController.delete
    );

    return router;
  }
}
