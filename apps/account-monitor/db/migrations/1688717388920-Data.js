module.exports = class Data1688717388920 {
    name = 'Data1688717388920'

    async up(db) {
        await db.query(`CREATE TABLE "nft" ("id" character varying NOT NULL, "total_supply" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "account_nft" ("id" SERIAL NOT NULL, "account_id" text, "nft_id" text, "accountId" character varying, "nftId" character varying, CONSTRAINT "PK_c340e89e548f9c4b04270ebb2df" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1e597cf65f30a49aa7890de059" ON "account_nft" ("accountId") `)
        await db.query(`CREATE INDEX "IDX_74b7464b0ecc26825ac901c763" ON "account_nft" ("nftId") `)
        await db.query(`CREATE TABLE "nft_transfer" ("id" SERIAL NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "pallet" text NOT NULL, "method" text NOT NULL, "from_id" character varying, "to_id" character varying, "nft_id" character varying, CONSTRAINT "PK_2d9d4b37560ecbcae8bd13026ab" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_14a7b9aab04cc732ed3c451e46" ON "nft_transfer" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_a16633d0bf670694384eb2cca4" ON "nft_transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_3f47532cfd7b9e620a22236dd4" ON "nft_transfer" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_e25e662117911bbbf337f8dcb6" ON "nft_transfer" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_c84f5916ed381a97f68c9a8fc4" ON "nft_transfer" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_36fe23e7d5ad132cc41db573a5" ON "nft_transfer" ("nft_id") `)
        await db.query(`CREATE INDEX "IDX_97345b768990d86ffd4af99af2" ON "nft_transfer" ("pallet") `)
        await db.query(`CREATE INDEX "IDX_586635da4b0b9d1cde4b890bc2" ON "nft_transfer" ("method") `)
        await db.query(`ALTER TABLE "account" ADD "avt_balance" numeric NOT NULL`)
        await db.query(`CREATE INDEX "IDX_e30019d293529390e105432e51" ON "account" ("avt_balance") `)
        await db.query(`ALTER TABLE "account_nft" ADD CONSTRAINT "FK_1e597cf65f30a49aa7890de0599" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "account_nft" ADD CONSTRAINT "FK_74b7464b0ecc26825ac901c7630" FOREIGN KEY ("nftId") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "nft_transfer" ADD CONSTRAINT "FK_e25e662117911bbbf337f8dcb62" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "nft_transfer" ADD CONSTRAINT "FK_c84f5916ed381a97f68c9a8fc4e" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "nft_transfer" ADD CONSTRAINT "FK_36fe23e7d5ad132cc41db573a51" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "nft"`)
        await db.query(`DROP TABLE "account_nft"`)
        await db.query(`DROP INDEX "public"."IDX_1e597cf65f30a49aa7890de059"`)
        await db.query(`DROP INDEX "public"."IDX_74b7464b0ecc26825ac901c763"`)
        await db.query(`DROP TABLE "nft_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_14a7b9aab04cc732ed3c451e46"`)
        await db.query(`DROP INDEX "public"."IDX_a16633d0bf670694384eb2cca4"`)
        await db.query(`DROP INDEX "public"."IDX_3f47532cfd7b9e620a22236dd4"`)
        await db.query(`DROP INDEX "public"."IDX_e25e662117911bbbf337f8dcb6"`)
        await db.query(`DROP INDEX "public"."IDX_c84f5916ed381a97f68c9a8fc4"`)
        await db.query(`DROP INDEX "public"."IDX_36fe23e7d5ad132cc41db573a5"`)
        await db.query(`DROP INDEX "public"."IDX_97345b768990d86ffd4af99af2"`)
        await db.query(`DROP INDEX "public"."IDX_586635da4b0b9d1cde4b890bc2"`)
        await db.query(`ALTER TABLE "account" DROP COLUMN "avt_balance"`)
        await db.query(`DROP INDEX "public"."IDX_e30019d293529390e105432e51"`)
        await db.query(`ALTER TABLE "account_nft" DROP CONSTRAINT "FK_1e597cf65f30a49aa7890de0599"`)
        await db.query(`ALTER TABLE "account_nft" DROP CONSTRAINT "FK_74b7464b0ecc26825ac901c7630"`)
        await db.query(`ALTER TABLE "nft_transfer" DROP CONSTRAINT "FK_e25e662117911bbbf337f8dcb62"`)
        await db.query(`ALTER TABLE "nft_transfer" DROP CONSTRAINT "FK_c84f5916ed381a97f68c9a8fc4e"`)
        await db.query(`ALTER TABLE "nft_transfer" DROP CONSTRAINT "FK_36fe23e7d5ad132cc41db573a51"`)
    }
}
