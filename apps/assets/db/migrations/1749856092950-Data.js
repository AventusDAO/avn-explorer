module.exports = class Data1749856092950 {
    name = 'Data1749856092950'

    async up(db) {
        await db.query(`CREATE TABLE "balance" ("id" character varying NOT NULL, "account" text NOT NULL, "free" numeric NOT NULL, "reserved" numeric NOT NULL, "updated_at" numeric NOT NULL, "asset_id" character varying, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7d8cc22f3f813ce146e741e7ff" ON "balance" ("asset_id") `)
        await db.query(`CREATE TABLE "asset" ("id" character varying NOT NULL, "symbol" text NOT NULL, "eth_address" text NOT NULL, "name" text, "decimals" integer, "base_asset" boolean NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "balance" ADD CONSTRAINT "FK_7d8cc22f3f813ce146e741e7ff4" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "balance" DROP CONSTRAINT "FK_7d8cc22f3f813ce146e741e7ff4"`)
        await db.query(`DROP TABLE "balance"`)
        await db.query(`DROP INDEX "public"."IDX_7d8cc22f3f813ce146e741e7ff"`)
        await db.query(`DROP TABLE "asset"`)
    }
}
