const createSchemaCommand = name => `CREATE SCHEMA ${name};`
const createUser = (name, password) => `CREATE USER ${name} WITH PASSWORD '${password}';`

const grantAllOnSchema = (schema, user) =>
  `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${schema} TO ${user};`

const grantUsageOnSchema = (schema, user) => `GRANT USAGE ON SCHEMA ${schema} TO ${user};`

const setDefaultScehma = (schema, user) => `ALTER USER ${user} SET search_path=${schema}, “$user”;`
// `ALTER USER ${user} SET search_path=${schema}, “$user”, public;`

export const conifgureDb = async client => {
  // todo
}
