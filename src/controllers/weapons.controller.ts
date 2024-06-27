import { Request, Response } from "express";
import { prismaConnection } from "../database/prisma.connection";

export class WeaponsController {
  public static async creat(request: Request, response: Response) {
    try {
      const { crimeId } = request.params;
      const { type } = request.body;

      // Verificar se o Type está sendo informado no body
      if (!type) {
        return response.status(400).json({
          ok: false,
          message: "O campo 'type' é obrigatório",
        });
      }

      // Verificação de ID existe no banco de dados:
      const existingCrime = await prismaConnection.crime.findUnique({
        where: {
          id: crimeId,
        },
      });

      if (!existingCrime) {
        return response.status(404).json({
          ok: false,
          message: "Crime não existe na base de dados",
        });
      }

      // Lógica para criar uma arma vinculada ao crime associado ao ID passado:
      const weapon = await prismaConnection.weapon.create({
        data: {
          type,
          crimeId,
        },
      });

      return response.status(201).json({
        ok: true,
        message: `Arma adicionada com sucesso ao crime ${existingCrime.type}`,
        weapon,
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

      const weapons = await prismaConnection.weapon.findMany({
        skip: limitDefault * (pageDefault - 1),
        take: limitDefault,
        orderBy: {
          type: "asc",
        },
        include: {
          crime: {
            select: {
              type: true,
            },
          },
        },
      });

      const count = await prismaConnection.crime.count();

      return response.status(201).json({
        ok: true,
        message: `Armas listadas abaixo:`,
        weapons: weapons,
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
