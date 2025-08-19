
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
      imageUrl: 'https://cdn.idntimes.com/content-images/community/2023/07/tulus-8de01c7d24269e1208a8f1585d56b0d9.jpg',
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
      imageUrl: 'https://cdn-image.hipwee.com/wp-content/uploads/2019/12/hipwee-Dewa-19-via-tribunnews.jpg',
      categoryId: rockCategory.id,
    },
     {
      name: 'Konser Tulus: Terbuka',
      description: 'Saksikan penampilan Tulus dalam suasana terbuka yang intim.',
      date: new Date('2025-11-10T19:30:00+07:00'),
      location: 'Amphitheater Alam Sutera, Tangerang',
      artist: 'Tulus',
      price: 280000.00,
      totalTickets: 500,
      availableTickets: 500,
      imageUrl: 'https://cdn.idntimes.com/content-images/community/2023/07/tulus-8de01c7d24269e1208a8f1585d56b0d9.jpg',
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
      imageUrl: 'https://cdn-image.hipwee.com/wp-content/uploads/2019/12/hipwee-Dewa-19-via-tribunnews.jpg',
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