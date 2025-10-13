import { db } from '../lib/db';
import { hobbies } from '../lib/db/schema';

async function checkHobbies() {
  try {
    console.log("Checking hobbies in MySQL database...\n");

    const allHobbies = await db.select().from(hobbies);

    console.log(`Total hobbies in database: ${allHobbies.length}\n`);

    if (allHobbies.length > 0) {
      console.log("Hobbies list:");
      allHobbies.forEach((hobby, index) => {
        console.log(`${index + 1}. ${hobby.name} (${hobby.category})`);
      });
    } else {
      console.log("No hobbies found in database.");
    }
  } catch (error) {
    console.error("Error checking database:", error);
    process.exit(1);
  }
  process.exit(0);
}

checkHobbies();
