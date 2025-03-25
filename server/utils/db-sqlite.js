const db = useDatabase()
let ids = [] // 用于shuffle

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
  await _loadIds()
  _shuffle(ids)
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
  if (await _flashcardIdExists(id)) {
    console.log("updating flashcard")
    const sqlResult =
      await db.sql`update flashcard set q = ${q}, a = ${a}, tags = ${tags}, note = ${note} where id = ${id}`
    logger.info("updating flashcard %o", sqlResult)
    return id
  } else {
    const sqlResult =
      await db.sql`insert into flashcard (q, a, tags, note) values (${q}, ${a}, ${tags}, ${note})`
    logger.info("inserting flashcard %o", sqlResult)
    _shuffleAdd(ids, sqlResult.lastInsertRowid)
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

export const utilDbGetRandom = async () => {
  if (ids.length === 0) {
    await _loadIds()
    _shuffle(ids)
  }
  const id = ids.pop()
  logger.debug("ids %s left", ids.length)
  return utilDbGet(id)
}

const _flashcardIdExists = async (id) => {
  logger.debug("checking if flashcard id exists %o", id)
  const sqlResult =
    await db.sql`select count(*) as count from flashcard where id = ${id}`
  logger.debug(sqlResult.rows[0].count > 0)

  return sqlResult.rows[0].count > 0
}

const _loadIds = async () => {
  const sqlResult = await db.sql`select id from flashcard`
  ids = sqlResult.rows.map((row) => row.id)
  logger.debug("loaded %s flashcard ids", ids.length)
}

// Fisher-Yates shuffle
const _shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
  return array
}

const _shuffleAdd = (array, id) => {
  const insertIndex = Math.floor(Math.random() * array.length)
  array.splice(insertIndex, 0, id)
}
