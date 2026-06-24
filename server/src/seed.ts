import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './config/db';

const mockUsersData = [
  { name: 'Alice Smith', email: 'alice@example.com' },
  { name: 'Bob Jones', email: 'bob@example.com' },
  { name: 'Charlie Brown', email: 'charlie@example.com' },
  { name: 'David Miller', email: 'david@example.com' },
  { name: 'Emma Wilson', email: 'emma@example.com' },
  { name: 'Frank Thomas', email: 'frank@example.com' },
  { name: 'Grace Taylor', email: 'grace@example.com' },
  { name: 'Henry Anderson', email: 'henry@example.com' },
  { name: 'Ivy White', email: 'ivy@example.com' },
  { name: 'Jack Martin', email: 'jack@example.com' },
  { name: 'Kate Garcia', email: 'kate@example.com' },
  { name: 'Liam Robinson', email: 'liam@example.com' },
  { name: 'Mia Clark', email: 'mia@example.com' },
  { name: 'Noah Rodriguez', email: 'noah@example.com' },
  { name: 'Olivia Lewis', email: 'olivia@example.com' },
];

async function main() {
  console.log('Starting seed process...');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const seededUsers = [];

  for (const mock of mockUsersData) {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: mock.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: mock.name,
          email: mock.email,
          passwordHash,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${mock.name.replace(' ', '')}`,
        },
      });
      console.log(`Created mock user: ${user.name}`);
    } else {
      console.log(`Mock user already exists: ${user.name}`);
    }
    seededUsers.push(user);
  }

  // Find all regular users in the system to connect them
  const allUsers = await prisma.user.findMany();
  const realUsers = allUsers.filter(u => !mockUsersData.some(mock => mock.email === u.email));

  if (realUsers.length === 0) {
    console.log('No real users found to establish friendships with. Please sign up an account first, then re-run the seed script.');
    return;
  }

  console.log(`Establishing friendships for ${realUsers.length} real user(s)...`);

  for (const realUser of realUsers) {
    // Make first 8 users ACCEPTED friends
    for (let i = 0; i < 8; i++) {
      const mockFriend = seededUsers[i];
      const existing = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: realUser.id, friendId: mockFriend.id },
            { userId: mockFriend.id, friendId: realUser.id },
          ],
        },
      });

      if (!existing) {
        await prisma.friendship.create({
          data: {
            userId: realUser.id,
            friendId: mockFriend.id,
            status: 'ACCEPTED',
          },
        });
        console.log(`Added friendship: ${realUser.name} <-> ${mockFriend.name}`);
      }
    }

    // Make next 3 users PENDING incoming friend requests
    for (let i = 8; i < 11; i++) {
      const mockFriend = seededUsers[i];
      const existing = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: realUser.id, friendId: mockFriend.id },
            { userId: mockFriend.id, friendId: realUser.id },
          ],
        },
      });

      if (!existing) {
        await prisma.friendship.create({
          data: {
            userId: mockFriend.id,
            friendId: realUser.id,
            status: 'PENDING',
          },
        });
        await prisma.notification.create({
          data: {
            userId: realUser.id,
            type: 'FRIEND_REQUEST',
            title: 'New Friend Request',
            content: `${mockFriend.name} sent you a friend request.`,
            link: '/friends',
          },
        });
        console.log(`Added pending request from ${mockFriend.name} to ${realUser.name}`);
      }
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
