// src/event/event.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query // Import Query untuk filter
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard dari passport
import { RolesGuard } from '../auth/guards/roles.guard'; // Import RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // Import Roles decorator
import { Role } from '@prisma/client'; // Import Role enum

@Controller('events')
// Semua rute di controller ini memerlukan autentikasi
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN) // Hanya admin yang bisa membuat event
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  // Semua user (USER atau ADMIN) bisa melihat daftar event
  // Tidak perlu @Roles di sini, karena AuthGuard sudah memastikan user login.
  // Jika Anda ingin *tidak perlu* login untuk melihat daftar event,
  // Anda bisa menghapus @UseGuards dari findAll() atau dari controller level.
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN) // Hanya admin yang bisa mengupdate event
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content untuk delete berhasil tanpa body
  @Roles(Role.ADMIN) // Hanya admin yang bisa menghapus event
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}