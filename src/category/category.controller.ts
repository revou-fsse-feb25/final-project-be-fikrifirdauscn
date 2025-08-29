// music-event-backend/src/category/category.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard dari passport
import { RolesGuard } from '../auth/guards/roles.guard'; // Import RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // Import Roles decorator
import { Role } from '@prisma/client'; // Import Role enum

@Controller('categories')
// Hapus @UseGuards dari sini
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Pindahkan ke sini
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  // <-- Endpoint ini sekarang publik
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  // <-- Endpoint ini juga publik
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Pindahkan ke sini
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // <-- Pindahkan ke sini
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}