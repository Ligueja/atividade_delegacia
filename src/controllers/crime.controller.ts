import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class CrimiesController {
  public static async create(request: Request, response: Response) {
    try {
      const { criminalId } = request.params;
      const { type } = request.body;

      // Verificar se o Type está sendo informado no body
      if (!type) {
        return response.status(400).json({
          ok: false,
          message: "O campo 'type' é obrigatório",
        });
      }

      // Verificação de ID existe no banco de dados:
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

      // Lógica para criar um crime vinculado ao criminal associado ao ID passado:
      const crime = await prismaConnection.crime.create({
        data: {
          type,
          criminalId,
        },
      });

      return response.status(201).json({
        ok: true,
        message: `Crime adicionado com sucesso ao criminios ${existingCriminal.name}`,
        crime,
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

      const crimes = await prismaConnection.crime.findMany({
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        orderBy: {
          type: "asc",
        },
        include: {
          criminal: {
            select: {
              name: true,
            },
          },
        },
      });

      const count = await prismaConnection.criminal.count();

      return response.status(201).json({
        ok: true,
        message: `Crimes listados abaixo:`,
        crimes: crimes,
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
}
