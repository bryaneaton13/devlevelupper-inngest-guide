import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = [
  { name: "Person 1", phone: "1235550100" },
  { name: "Person 2", phone: "1235550101" },
  { name: "Person 3", phone: "1235550102" },
  { name: "Person 4", phone: "1235550103" },
  { name: "Person 5", phone: "1235550104" },
  { name: "Person 6", phone: "1235550105" },
  { name: "Person 7", phone: "1235550106" },
  { name: "Person 8", phone: "1235550107" },
  { name: "Person 9", phone: "1235550108" },
  { name: "Person 10", phone: "1235550109" },
  { name: "Person 11", phone: "1235550110" },
  { name: "Person 12", phone: "1235550111" },
  { name: "Person 13", phone: "1235550112" },
  { name: "Person 14", phone: "1235550113" },
  { name: "Person 15", phone: "1235550114" },
  { name: "Person 16", phone: "1235550115" },
  { name: "Person 17", phone: "1235550116" },
  { name: "Person 18", phone: "1235550117" },
  { name: "Person 19", phone: "1235550118" },
  { name: "Person 20", phone: "1235550119" },
  { name: "Person 21", phone: "1235550120" },
  { name: "Person 22", phone: "1235550121" },
  { name: "Person 23", phone: "1235550122" },
  { name: "Person 24", phone: "1235550123" },
  { name: "Person 25", phone: "1235550124" },
];

async function main() {
  const existingOrg1 = await prisma.organization.findFirst({
    where: { name: "Org 1" },
  });
  if (!existingOrg1) {
    await prisma.organization.create({
      data: {
        name: "Org 1",
        Broadcasts: {
          createMany: {
            data: [
              { message: "Hello, today!", time: new Date() },
              {
                message: "Hello, tomorrow!",
                time: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
            ],
          },
        },
        Users: { createMany: { data: users } },
      },
    });
  }

  const existingOrg2 = await prisma.organization.findFirst({
    where: { name: "Org 2" },
  });
  if (!existingOrg2) {
    await prisma.organization.create({
      data: {
        name: "Org 2",
        Users: {
          createMany: {
            data: users.map((u) => ({
              ...u,
              name: u.name.replace("Person", "User"),
            })),
          },
        },
      },
    });
  }

  console.log("Finished seeding");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
