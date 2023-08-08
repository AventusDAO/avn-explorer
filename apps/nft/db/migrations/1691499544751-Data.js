module.exports = class Data1691499544751 {
    name = 'Data1691499544751'

    async up(db) {
        await db.query(`ALTER TABLE "batch" DROP COLUMN "unique_external_ref"`)
        await db.query(`ALTER TABLE "batch" ADD "total_supply" integer NOT NULL`)
        await db.query(`ALTER TABLE "batch" ALTER COLUMN "t1_authority" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "batch" ADD "unique_external_ref" text`)
        await db.query(`ALTER TABLE "batch" DROP COLUMN "total_supply"`)
        await db.query(`ALTER TABLE "batch" ALTER COLUMN "t1_authority" DROP NOT NULL`)
    }
}
