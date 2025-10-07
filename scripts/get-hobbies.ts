import { db } from "../lib/db/index.js";
import { hobbies } from "../lib/db/schema.js";

async function getHobbies() {
  const result = await db.select({
    id: hobbies.id,
    name: hobbies.name,
    category: hobbies.category,
  }).from(hobbies);

  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

getHobbies();
