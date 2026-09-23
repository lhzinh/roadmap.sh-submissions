import { db } from "./db.ts";

async function main(): Promise<void> {
  // for (const user of users) {
  //   await db.orm.public.User.upsert({
  //     create: user,
  //     update: {},
  //     conflictOn: { email: user.email },
  //   });
  // }

  // console.log(users);

  await db.close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});