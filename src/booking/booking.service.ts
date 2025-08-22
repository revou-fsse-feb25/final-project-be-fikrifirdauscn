import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const { eventId, numberOfTickets } = createBookingDto;

    
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event tidak ditemukan.');
    }

    
    if (event.availableTickets < numberOfTickets) {
      throw new ConflictException(`Maaf, hanya ada ${event.availableTickets} tiket yang tersedia.`);
    }

    
    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        availableTickets: {
          decrement: numberOfTickets,
        },
      },
    });

    
    const totalPrice = updatedEvent.price * numberOfTickets;

   
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        eventId,
        numberOfTickets,
        totalPrice,
      },
      include: {
        event: {
          select: { name: true, date: true, artist: true, location: true }, 
        },
      },
    });

    return booking;
  }

  
  async findMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        event: {
          select: { name: true, date: true, artist: true, location: true },
        },
      },
      orderBy: { bookingDate: 'desc' },
    });
  }

  
  async findAllBookings() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } }, 
        event: {
          select: { name: true, date: true, artist: true, location: true },
        },
      },
      orderBy: { bookingDate: 'desc' },
    });
  }
}