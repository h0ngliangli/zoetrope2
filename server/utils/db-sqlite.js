// eslint-disable-next-line no-undef
const db = useDatabase()

export const utilDbInit = async () => {
  // create tables
  await db.sql`create table if not exists flashcard (
        id integer,
        q text,
        a text,
        tags text,
        note text,
        img text,
        log text,
        primary key (id autoincrement)
    )`
}

/**
 * Save a flashcard to database
 * @param {*} param0 flashcard object {q, a, tags, note}
 * @returns  id of the new flashcard
 */
export const utilDbSave = async ({ q, a, tags = "", note = "" }) => {
  if (!q || !a) {
    throw new Error("Question and answer cannot be empty")
  }
  if (tags) {
    // 在后面增加一个空格，以便在搜索时能够精确匹配
    tags =
      tags
        .split(" ")
        .filter((tag) => tag)
        .join(" ") + " "
  }
  const sqlResult =
    await db.sql`insert into flashcard (q, a, tags, note) values (${q}, ${a}, ${tags}, ${note})`
  logger.info("inserting flashcard %o", sqlResult)
  return sqlResult.lastInsertRowid
}

export const utilDbGet = async (id) => {
  const sqlResult = await db.sql`select * from flashcard where id = ${id}`
  if (sqlResult.rows.length === 0) {
    return null
  }
  return sqlResult.rows[0]
}
