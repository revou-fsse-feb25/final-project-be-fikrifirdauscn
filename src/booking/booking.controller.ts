import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.USER, Role.ADMIN)
  async create(@Req() req, @Body() createBookingDto: CreateBookingDto) {

    const userId = req.user.id;
    return this.bookingService.create(userId, createBookingDto);
  }

  @Get('my')
  @Roles(Role.USER, Role.ADMIN) 
  async findMyBookings(@Req() req) {
    const userId = req.user.id;
    return this.bookingService.findMyBookings(userId);
  }

  @Get()
  @Roles(Role.ADMIN) 
  async findAllBookings() {
    return this.bookingService.findAllBookings();
  }
}