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
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Pindahkan ke sini
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  // <-- Rute ini sekarang publik
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  // <-- Rute ini juga publik
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Pindahkan ke sini
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Pindahkan ke sini
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}