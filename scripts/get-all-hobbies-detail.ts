import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';

async function getAllHobbiesDetail() {
  try {
    const allHobbies = await db.select().from(hobbies);

    console.log(JSON.stringify(allHobbies, null, 2));
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
  process.exit(0);
}

getAllHobbiesDetail();
