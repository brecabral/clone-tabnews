import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
      SELECT 
        * 
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "username não encontrado.",
        action: "Verifique se username está digitado corretamente.",
      });
    }

    return result.rows[0];
  }
}

async function create(userIputValues) {
  await validadeUniqueEmail(userIputValues.email);
  await validadeUniqueUsername(userIputValues.username);

  const newUser = await runInsertQuery(userIputValues);
  return newUser;

  async function validadeUniqueEmail(email) {
    const result = await database.query({
      text: `
      SELECT 
        (email) 
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
      values: [email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já esta em uso.",
        action: "Use outro email.",
      });
    }
  }

  async function validadeUniqueUsername(username) {
    const result = await database.query({
      text: `
      SELECT 
        (username) 
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O usuário informado já esta em uso.",
        action: "Use outro usuário.",
      });
    }
  }

  async function runInsertQuery(userIputValues) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userIputValues.username,
        userIputValues.email,
        userIputValues.password,
      ],
    });
    return result.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
