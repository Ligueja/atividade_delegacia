import { Router } from "express";
import { CreateWeaponsMiddleware } from "../middlewares/weapons/weaponscreate.middlewares";
import { WeaponsController } from "../controllers/weapons.controller";

export class weaponsRoutes {
  public static execute(): Router {
    const router = Router();

    // definição de rotas:
    router.post(
      "/:crimeId",
      [CreateWeaponsMiddleware.validate],
      WeaponsController.creat
    );

    router.get("/", WeaponsController.list);

    return router;
  }
}
