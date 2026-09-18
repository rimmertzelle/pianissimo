import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/database.sqlite',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.taskTag.deleteMany();
  await prisma.task.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: 'The Fellowship of the Ring',
      description: 'Forming the fellowship and beginning the journey to Mordor',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'The Two Towers',
      description: 'Battles, alliances and the war against Saruman',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'The Return of the King',
      description: 'The final stand against Sauron and the return of Aragorn',
    },
  });

  // Create tags
  const tagMen = await prisma.tag.create({
    data: {
      title: 'Men',
    },
  });

  const tagHobbits = await prisma.tag.create({
    data: {
      title: 'Hobbits',
    },
  });

  const tagElves = await prisma.tag.create({
    data: {
      title: 'Elves',
    },
  });

  const tagDwarves = await prisma.tag.create({
    data: {
      title: 'Dwarves',
    },
  });

  // Create tasks for project 1
  const task1 = await prisma.task.create({
    data: {
      title: 'Form the Fellowship',
      description: 'Assemble representatives of the Free Peoples in Rivendell',
      priority: 1,
      status: 4,
      progress: 100,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(),
      projectId: project1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Cross the Misty Mountains',
      description: 'Find a safe passage through or around the mountains',
      priority: 2,
      status: 4,
      progress: 100,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(),
      projectId: project1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Enter Moria',
      description: 'Take the risky path through the Mines of Moria',
      priority: 3,
      status: 1,
      progress: 70,
      projectId: project1.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Battle the Balrog',
      description: 'Gandalf confronts the Balrog to protect the fellowship',
      priority: 1,
      status: 2,
      progress: 50,
      projectId: project1.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Reach Lothlórien',
      description: 'Find refuge and counsel with Galadriel',
      priority: 2,
      status: 2,
      progress: 50,
      projectId: project1.id,
    },
  });

  // Create tasks for project 2
  const task6 = await prisma.task.create({
    data: {
      title: 'Track the Uruk-hai',
      description: 'Aragorn, Legolas and Gimli pursue the captured hobbits',
      priority: 2,
      status: 2,
      progress: 50,
      projectId: project2.id,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      title: 'Entmoot',
      description: 'Merry and Pippin persuade the Ents to fight Saruman',
      priority: 3,
      status: 2,
      progress: 50,
      projectId: project2.id,
    },
  });

  const task8 = await prisma.task.create({
    data: {
      title: "Siege of Helm's Deep",
      description: "Defend the fortress from Saruman's army",
      priority: 1,
      status: 2,
      progress: 50,
      projectId: project2.id,
    },
  });

  const task9 = await prisma.task.create({
    data: {
      title: 'Gandalf returns',
      description: 'Gandalf the White returns to aid Rohan',
      priority: 1,
      status: 2,
      progress: 50,
      projectId: project2.id,
    },
  });

  const task10 = await prisma.task.create({
    data: {
      title: 'Defeat Saruman',
      description: "Confront Saruman at Isengard after his defeat",
      priority: 2,
      status: 2,
      progress: 50,
      projectId: project2.id,
    },
  });

  // Create tasks for project 3
  const task11 = await prisma.task.create({
    data: {
      title: 'Journey to Minas Tirith',
      description: "Prepare for the battle against Sauron's forces",
      priority: 2,
      status: 1,
      progress: 50,
      projectId: project3.id,
    },
  });

  const task12 = await prisma.task.create({
    data: {
      title: 'Battle of Pelennor Fields',
      description: 'Defend the city from the forces of Mordor',
      priority: 1,
      status: 2,
      progress: 50,
      projectId: project3.id,
    },
  });

  const task13 = await prisma.task.create({
    data: {
      title: 'The Paths of the Dead',
      description: 'Aragorn seeks aid from the Dead Men of Dunharrow',
      priority: 2,
      status: 2,
      progress: 50,
      projectId: project3.id,
    },
  });

  const task14 = await prisma.task.create({
    data: {
      title: 'Distract Sauron',
      description: "March on the Black Gate to draw Sauron's gaze",
      priority: 3,
      status: 2,
      progress: 50,
      projectId: project3.id,
    },
  });

  const task15 = await prisma.task.create({
    data: {
      title: 'Destroy the Ring',
      description: 'Frodo and Sam reach Mount Doom and destroy the Ring',
      priority: 1,
      status: 2,
      progress: 50,
      projectId: project3.id,
    },
  });

  // Create task-tag relationships (adding some sample associations)
  await prisma.taskTag.createMany({
    data: [
      { taskId: task1.id, tagId: tagHobbits.id },
      { taskId: task1.id, tagId: tagElves.id },
      { taskId: task2.id, tagId: tagDwarves.id },
      { taskId: task3.id, tagId: tagHobbits.id },
      { taskId: task3.id, tagId: tagDwarves.id },
      { taskId: task4.id, tagId: tagElves.id },
      { taskId: task5.id, tagId: tagElves.id },
      { taskId: task6.id, tagId: tagMen.id },
      { taskId: task7.id, tagId: tagHobbits.id },
      { taskId: task8.id, tagId: tagMen.id },
      { taskId: task9.id, tagId: tagElves.id },
      { taskId: task10.id, tagId: tagMen.id },
      { taskId: task11.id, tagId: tagMen.id },
      { taskId: task12.id, tagId: tagMen.id },
      { taskId: task13.id, tagId: tagMen.id },
      { taskId: task14.id, tagId: tagMen.id },
      { taskId: task15.id, tagId: tagHobbits.id },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${3} projects`);
  console.log(`✓ Created ${4} tags`);
  console.log(`✓ Created ${15} tasks`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
