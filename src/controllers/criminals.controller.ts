import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class CriminalsController {
  public static async create(request: Request, response: Response) {
    try {
      const { name } = request.body;

      const newCriminal = await prismaConnection.criminal.create({
        data: {
          name,
        },
      });

      return response.status(201).json({
        ok: true,
        message: `Criminoso cadastrado com sucesso`,
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async list(request: Request, response: Response) {
    try {
      let { limit, page } = request.query;

      let limitDefault = 5;
      let pageDefault = 1;

      if (limit) {
        limitDefault = Number(limit);
      }

      if (page) {
        pageDefault = Number(page);
      }

      const criminals = await prismaConnection.criminal.findMany({
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        orderBy: {
          name: "asc",
        },
        include: {
          crime: {
            include: {
              Weapon: true,
            },
          },
        },
      });

      const count = await prismaConnection.criminal.count();

      return response.status(201).json({
        ok: true,
        message: `Criminosos listados abaixo:`,
        criminals: criminals,
        pagination: {
          limit: limitDefault,
          page: pageDefault,
          count: count,
          totalPages: Math.ceil(count / limitDefault),
        },
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async get(request: Request, response: Response) {
    try {
      const { criminalId } = request.params;

      const criminalFound = await prismaConnection.criminal.findUnique({
        where: {
          id: criminalId,
        },
      });

      if (!criminalFound) {
        return response.status(404).json({
          ok: false,
          message: "Criminoso não existe na base de dados",
        });
      }
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async put(request: Request, response: Response) {
    try {
      const { criminalId } = request.params;
      const { name } = request.body;

      // verificando se existe algumn criminoso com o id cadastrado
      const existingCriminal = await prismaConnection.criminal.findUnique({
        where: {
          id: criminalId,
        },
      });

      if (!existingCriminal) {
        return response.status(404).json({
          ok: false,
          message: "Criminoso não existe na base de dados",
        });
      }

      // se existir o id informado, dai abaixo prossegue para atualização do nome:
      const criminalUpdated = await prismaConnection.criminal.update({
        where: {
          id: criminalId,
        },
        data: {
          name,
        },
      });

      return response.status(201).json({
        ok: true,
        message: `Criminoso atualizado com sucesso`,
        criminalUpdated,
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }

  public static async delete(request: Request, response: Response) {
    try {
      const { criminalId } = request.params;

      // verificando se existe algumn criminoso com o id cadastrado
      const existingCriminal = await prismaConnection.criminal.findUnique({
        where: {
          id: criminalId,
        },
      });

      if (!existingCriminal) {
        return response.status(404).json({
          ok: false,
          message: "Criminoso não existe na base de dados",
        });
      }

      // se existir o id informado, dai abaixo prossegue para atualização do nome:
      const criminalDeleted = await prismaConnection.criminal.delete({
        where: {
          id: criminalId,
        },
      });

      return response.status(201).json({
        ok: true,
        message: `Criminoso deletado com sucesso`,
        criminalDeleted,
      });
    } catch (err) {
      return response.status(500).json({
        ok: false,
        message: `Ocorreu um erro inesperado. Erro:${(err as Error).name} - ${
          (err as Error).message
        }`,
      });
    }
  }
}
