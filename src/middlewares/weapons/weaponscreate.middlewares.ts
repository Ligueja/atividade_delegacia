import { NextFunction, Request, Response } from "express";
import { validate as isValidUUID } from "uuid";

export class CreateWeaponsMiddleware {
  public static validate(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { crimeId } = request.params;

    // Verifique se o criminalId é um UUID válido
    if (!isValidUUID(crimeId)) {
      return response.status(400).json({
        ok: false,
        message: "O ID informado não é válido",
      });
    }

    return next();
  }
}
