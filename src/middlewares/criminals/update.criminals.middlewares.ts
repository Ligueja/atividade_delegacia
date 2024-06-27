import { NextFunction, Request, Response } from "express";
import { validate as isValidUUID } from "uuid";

export class UpdateCriminalsMiddleware {
  public static validate(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { name } = request.body;
    const { criminalId } = request.params;

    // Verifique se o criminalId é um UUID válido
    if (!isValidUUID(criminalId)) {
      return response.status(400).json({
        ok: false,
        message: "O ID informado não é válido",
      });
    }

    if (!name || typeof name !== "string") {
      return response.status(400).json({
        ok: false,
        message: "Nome é obrigatório",
      });
    }

    return next();
  }
}
