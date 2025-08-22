import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const { name, date, totalTickets, categoryId, ...rest } = createEventDto;

    const existingEvent = await this.prisma.event.findUnique({ where: { name } });
    if (existingEvent) {
      throw new ConflictException('Event dengan nama ini sudah ada.');
    }

    if (categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        throw new BadRequestException('ID Kategori tidak valid.');
      }
    }

    return this.prisma.event.create({
      data: {
        name,
        date: new Date(date),
        totalTickets,
        availableTickets: totalTickets,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        ...rest,
      },
    });
  }

  
  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { category: true },
    });
  }

  
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!event) {
      throw new NotFoundException(`Event dengan ID "${id}" tidak ditemukan.`);
    }
    return event;
  }

  
  async update(id: string, updateEventDto: UpdateEventDto) {
    const existingEvent = await this.prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      throw new NotFoundException(`Event dengan ID "${id}" tidak ditemukan.`);
    }
    
    const dataToUpdate: any = {
        ...updateEventDto,
        date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
    };

    if (updateEventDto.totalTickets !== undefined && updateEventDto.totalTickets < existingEvent.totalTickets) {
      const bookedTickets = existingEvent.totalTickets - existingEvent.availableTickets;
      if (updateEventDto.totalTickets < bookedTickets) {
        throw new BadRequestException(`Total tiket baru (${updateEventDto.totalTickets}) tidak boleh kurang dari tiket yang sudah dibooking (${bookedTickets}).`);
      }
      dataToUpdate.availableTickets = updateEventDto.totalTickets - bookedTickets;
    } else if (updateEventDto.totalTickets !== undefined && updateEventDto.totalTickets > existingEvent.totalTickets) {
      dataToUpdate.availableTickets = existingEvent.availableTickets + (updateEventDto.totalTickets - existingEvent.totalTickets);
    }
    
    if (updateEventDto.categoryId) {
        const category = await this.prisma.category.findUnique({ where: { id: updateEventDto.categoryId } });
        if (!category) {
            throw new BadRequestException('ID Kategori tidak valid.');
        }
        dataToUpdate.category = { connect: { id: updateEventDto.categoryId } };
    } else if (updateEventDto.categoryId === null) {
        dataToUpdate.category = { disconnect: true };
    }
    
    delete dataToUpdate.categoryId;

    return this.prisma.event.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  
  async remove(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event dengan ID "${id}" tidak ditemukan.`);
    }

    const bookingsCount = await this.prisma.booking.count({ where: { eventId: id } });
    if (bookingsCount > 0) {
      throw new ConflictException('Tidak dapat menghapus event karena ada booking yang terkait.');
    }

    return this.prisma.event.delete({ where: { id } });
  }
}