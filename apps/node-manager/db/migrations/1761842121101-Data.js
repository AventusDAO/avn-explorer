module.exports = class Data1761842121101 {
    name = 'Data1761842121101'

    async up(db) {
        await db.query(`ALTER TABLE "node" ADD "registered" boolean NOT NULL DEFAULT true`)

        // await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)

        // await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)

        // await db.query(`GRANT USAGE ON SCHEMA squid_processor To readonly`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA squid_processor TO readonly`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA squid_processor TO readonly`)

        // await db.query(`GRANT USAGE ON SCHEMA squid_processor To explorer_ro`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA squid_processor TO explorer_ro`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA squid_processor TO explorer_ro`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "node" DROP COLUMN "registered"`)
    }
}
