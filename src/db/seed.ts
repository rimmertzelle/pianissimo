import 'dotenv/config';
import { db } from '../lib/db';
import { projects, tasks, tags, taskTags } from './schema';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await db.delete(taskTags);
  await db.delete(tasks);
  await db.delete(tags);
  await db.delete(projects);

  // Create projects
  const [project1, project2, project3] = await db
    .insert(projects)
    .values([
      {
        title: 'The Fellowship of the Ring',
        description: 'Forming the fellowship and beginning the journey to Mordor',
      },
      {
        title: 'The Two Towers',
        description: 'Battles, alliances and the war against Saruman',
      },
      {
        title: 'The Return of the King',
        description: 'The final stand against Sauron and the return of Aragorn',
      },
    ])
    .returning();

  // Create tags
  const [tagMen, tagHobbits, tagElves, tagDwarves] = await db
    .insert(tags)
    .values([{ title: 'Men' }, { title: 'Hobbits' }, { title: 'Elves' }, { title: 'Dwarves' }])
    .returning();

  // Create tasks for project 1
  const [task1, task2, task3, task4, task5] = await db
    .insert(tasks)
    .values([
      {
        title: 'Form the Fellowship',
        description: 'Assemble representatives of the Free Peoples in Rivendell',
        priority: 1,
        status: 4,
        progress: 100,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedAt: new Date(),
        projectId: project1.id,
      },
      {
        title: 'Cross the Misty Mountains',
        description: 'Find a safe passage through or around the mountains',
        priority: 2,
        status: 4,
        progress: 100,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(),
        projectId: project1.id,
      },
      {
        title: 'Enter Moria',
        description: 'Take the risky path through the Mines of Moria',
        priority: 3,
        status: 1,
        progress: 70,
        projectId: project1.id,
      },
      {
        title: 'Battle the Balrog',
        description: 'Gandalf confronts the Balrog to protect the fellowship',
        priority: 1,
        status: 2,
        progress: 50,
        projectId: project1.id,
      },
      {
        title: 'Reach Lothlórien',
        description: 'Find refuge and counsel with Galadriel',
        priority: 2,
        status: 2,
        progress: 50,
        projectId: project1.id,
      },
    ])
    .returning();

  // Create tasks for project 2
  const [task6, task7, task8, task9, task10] = await db
    .insert(tasks)
    .values([
      {
        title: 'Track the Uruk-hai',
        description: 'Aragorn, Legolas and Gimli pursue the captured hobbits',
        priority: 2,
        status: 2,
        progress: 50,
        projectId: project2.id,
      },
      {
        title: 'Entmoot',
        description: 'Merry and Pippin persuade the Ents to fight Saruman',
        priority: 3,
        status: 2,
        progress: 50,
        projectId: project2.id,
      },
      {
        title: "Siege of Helm's Deep",
        description: "Defend the fortress from Saruman's army",
        priority: 1,
        status: 2,
        progress: 50,
        projectId: project2.id,
      },
      {
        title: 'Gandalf returns',
        description: 'Gandalf the White returns to aid Rohan',
        priority: 1,
        status: 2,
        progress: 50,
        projectId: project2.id,
      },
      {
        title: 'Defeat Saruman',
        description: 'Confront Saruman at Isengard after his defeat',
        priority: 2,
        status: 2,
        progress: 50,
        projectId: project2.id,
      },
    ])
    .returning();

  // Create tasks for project 3
  const [task11, task12, task13, task14, task15] = await db
    .insert(tasks)
    .values([
      {
        title: 'Journey to Minas Tirith',
        description: "Prepare for the battle against Sauron's forces",
        priority: 2,
        status: 1,
        progress: 50,
        projectId: project3.id,
      },
      {
        title: 'Battle of Pelennor Fields',
        description: 'Defend the city from the forces of Mordor',
        priority: 1,
        status: 2,
        progress: 50,
        projectId: project3.id,
      },
      {
        title: 'The Paths of the Dead',
        description: 'Aragorn seeks aid from the Dead Men of Dunharrow',
        priority: 2,
        status: 2,
        progress: 50,
        projectId: project3.id,
      },
      {
        title: 'Distract Sauron',
        description: "March on the Black Gate to draw Sauron's gaze",
        priority: 3,
        status: 2,
        progress: 50,
        projectId: project3.id,
      },
      {
        title: 'Destroy the Ring',
        description: 'Frodo and Sam reach Mount Doom and destroy the Ring',
        priority: 1,
        status: 2,
        progress: 50,
        projectId: project3.id,
      },
    ])
    .returning();

  // Create task-tag relationships (adding some sample associations)
  await db.insert(taskTags).values([
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
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${3} projects`);
  console.log(`✓ Created ${4} tags`);
  console.log(`✓ Created ${15} tasks`);
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
