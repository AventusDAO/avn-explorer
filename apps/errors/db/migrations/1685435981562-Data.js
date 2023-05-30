module.exports = class Data1685435981562 {
    name = 'Data1685435981562'

    async up(db) {
        await db.query(`ALTER TABLE "extrinsic_error" ALTER COLUMN "extrinsic_hash" DROP NOT NULL`)
        await db.query(`ALTER TABLE "extrinsic_error" ALTER COLUMN "message" DROP NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "extrinsic_error" ALTER COLUMN "extrinsic_hash" SET NOT NULL`)
        await db.query(`ALTER TABLE "extrinsic_error" ALTER COLUMN "message" SET NOT NULL`)
    }
}
