module.exports = class Data1684626770473 {
    name = 'Data1684626770473'

    async up(db) {
        await db.query(`CREATE OR REPLACE FUNCTION notify_new_transfer() RETURNS trigger AS $$
      DECLARE
      BEGIN
        PERFORM pg_notify('new_transfer', NEW.id::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;`)
      await db.query(`CREATE TRIGGER new_transfer_trigger AFTER INSERT ON transfer
      FOR EACH ROW EXECUTE PROCEDURE notify_new_transfer();`)
    }

    async down(db) {
        await db.query(`DROP TRIGGER new_transfer_trigger ON transfer`);
        await db.query(`DROP FUNCTION notify_new_transfer()`);
    }
}
