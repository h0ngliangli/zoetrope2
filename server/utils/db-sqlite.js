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
export const utilDbSave = async ({
  id = 0,
  q = "",
  a = "",
  tags = "",
  note = "",
}) => {
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
  if ((await _flashcardIdExists(id))) {
    console.log("updating flashcard")
    const sqlResult =
      await db.sql`update flashcard set q = ${q}, a = ${a}, tags = ${tags}, note = ${note} where id = ${id}`
    logger.info("updating flashcard %o", sqlResult)
    return id
  } else {
    const sqlResult =
      await db.sql`insert into flashcard (q, a, tags, note) values (${q}, ${a}, ${tags}, ${note})`
    logger.info("inserting flashcard %o", sqlResult)
    return sqlResult.lastInsertRowid
  }
}

export const utilDbGet = async (id) => {
  const sqlResult = await db.sql`select * from flashcard where id = ${id}`
  if (sqlResult.rows.length === 0) {
    return null
  }
  // 去掉tags后面的空格
  sqlResult.rows[0].tags = sqlResult.rows[0].tags.trim()
  return sqlResult.rows[0]
}

const _flashcardIdExists = async (id) => {
  logger.debug("checking if flashcard id exists %o", id)
  const sqlResult =
    await db.sql`select count(*) as count from flashcard where id = ${id}`
  logger.debug(sqlResult.rows[0].count > 0)
  
  return sqlResult.rows[0].count > 0
}
