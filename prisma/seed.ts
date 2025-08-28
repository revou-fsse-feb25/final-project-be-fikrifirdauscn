
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai seeding database (versi sederhana)...');

  
  const popCategory = await prisma.category.upsert({
    where: { name: 'Pop' },
    update: {},
    create: { name: 'Pop' },
  });
  console.log(`Dibuat/diperbarui kategori: ${popCategory.name} (ID: ${popCategory.id})`);

  const rockCategory = await prisma.category.upsert({
    where: { name: 'Rock' },
    update: {},
    create: { name: 'Rock' },
  });
  console.log(`Dibuat/diperbarui kategori: ${rockCategory.name} (ID: ${rockCategory.id})`);


  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPasswordAdmin, 
      name: 'Admin User',
      role: Role.ADMIN
    },
    create: {
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      name: 'Admin User',
      role: Role.ADMIN,
    },
    select: { id: true, email: true, name: true, role: true },
  });
  console.log(`Dibuat/diperbarui user: ${adminUser.email} (ID: ${adminUser.id}, Role: ${adminUser.role})`);

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      password: hashedPasswordUser,
      name: 'Regular User',
      role: Role.USER
    },
    create: {
      email: 'user@example.com',
      password: hashedPasswordUser,
      name: 'Regular User',
      role: Role.USER,
    },
    select: { id: true, email: true, name: true, role: true },
  });
  console.log(`Dibuat/diperbarui user: ${regularUser.email} (ID: ${regularUser.id}, Role: ${regularUser.role})`);

  
  const eventsData = [
  {
    name: 'Konser Tulus: Manusia',
    description: 'Nikmati malam yang syahdu bersama Tulus dalam konser Manusia.',
    date: new Date('2025-09-20T19:00:00+07:00'),
    location: 'Istora Senayan, Jakarta',
    artist: 'Tulus',
    price: 300000.00,
    totalTickets: 800,
    availableTickets: 800,
    imageUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQI7lgcJrU55cmdI151LbZdBgxVCVcWRLerC3t6osfk7Z13zw7fp4Ogo-uZNwUZcJckF72wFvaZ9MwLjKVBHb3PWA',
    categoryId: popCategory.id,
  },
  {
    name: 'Dewa 19: Pesta Rakyat',
    description: 'Perayaan 30 tahun Dewa 19 bersama Baladewa!',
    date: new Date('2025-10-15T20:00:00+07:00'),
    location: 'Gelora Bung Karno Stadium, Jakarta',
    artist: 'Dewa 19',
    price: 500000.00,
    totalTickets: 2500,
    availableTickets: 2500,
    imageUrl: 'https://asset.kompas.com/crops/pJGeAbFRyF_nbfKf8N-CLCJNMII=/0x0:750x500/1200x800/data/photo/2022/01/14/61e0fed042581.png',
    categoryId: rockCategory.id,
  },
  {
    name: 'Konser Sheila On 7: Tunggu Aku di Jakarta',
    description: 'Konser reuni Sheila On 7 di Jakarta.',
    date: new Date('2026-01-25T19:00:00Z'),
    location: 'JIExpo Kemayoran, Jakarta',
    artist: 'Sheila On 7',
    price: 280000,
    totalTickets: 1500,
    availableTickets: 1500,
    imageUrl: 'https://pbs.twimg.com/profile_images/887961128554217472/aExj9NAK_400x400.jpg',
    categoryId: popCategory.id,
  },
  {
    name: 'Dewa 19: Rock Legenda',
    description: 'Malam penuh nostalgia dengan lagu-lagu hits Dewa 19.',
    date: new Date('2025-12-01T21:00:00+07:00'),
    location: 'Balai Sarbini, Jakarta',
    artist: 'Dewa 19',
    price: 450000.00,
    totalTickets: 700,
    availableTickets: 700,
    imageUrl: 'https://asset.kompas.com/crops/pJGeAbFRyF_nbfKf8N-CLCJNMII=/0x0:750x500/1200x800/data/photo/2022/01/14/61e0fed042581.png',
    categoryId: rockCategory.id,
  }
];

  for (const data of eventsData) {
    const event = await prisma.event.upsert({
      where: { name: data.name },
      update: {
        description: data.description,
        date: data.date,
        location: data.location,
        artist: data.artist,
        price: data.price,
        totalTickets: data.totalTickets,
        availableTickets: data.availableTickets,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      },
      create: {
        name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
        artist: data.artist,
        price: data.price,
        totalTickets: data.totalTickets,
        availableTickets: data.availableTickets,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      },
    });
    console.log(`Dibuat/diperbarui event: ${event.name} (ID: ${event.id})`);
  }

  console.log('Seeding database selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });