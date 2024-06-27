import { Router } from "express";
import { CreateCrimesMiddleware } from "../middlewares/crimes/create.crimes.middlewares";
import { CrimiesController } from "../controllers/crime.controller";

export class crimesRoutes {
  public static execute(): Router {
    const router = Router();

    // definição de rotas:
    router.post(
      "/:criminalId",
      [CreateCrimesMiddleware.validate],
      CrimiesController.create
    );

    router.get("/", CrimiesController.list);

    return router;
  }
}
