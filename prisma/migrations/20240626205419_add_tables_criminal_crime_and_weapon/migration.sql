-- CreateEnum
CREATE TYPE "TipoCrime" AS ENUM ('Furto', 'Roubo', 'Homicidio', 'Trafico');

-- CreateEnum
CREATE TYPE "TipoArma" AS ENUM ('Nenhuma', 'Branca', 'Fogo');

-- CreateTable
CREATE TABLE "criminals" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "criminals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crimes" (
    "id" UUID NOT NULL,
    "type" "TipoCrime" NOT NULL,
    "criminal_id" UUID NOT NULL,

    CONSTRAINT "crimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weapons" (
    "id" UUID NOT NULL,
    "type" "TipoArma" NOT NULL,
    "crime_id" UUID NOT NULL,

    CONSTRAINT "weapons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "crimes" ADD CONSTRAINT "crimes_criminal_id_fkey" FOREIGN KEY ("criminal_id") REFERENCES "criminals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weapons" ADD CONSTRAINT "weapons_crime_id_fkey" FOREIGN KEY ("crime_id") REFERENCES "crimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
