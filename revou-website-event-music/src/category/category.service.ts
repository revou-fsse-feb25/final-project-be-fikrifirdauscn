import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const existingCategory = await this.prisma.category.findUnique({ where: { name } });

    if (existingCategory) {
      throw new ConflictException('Nama kategori sudah ada');
    }

    return this.prisma.category.create({ data: { name } });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Kategori dengan ID "${id}" tidak ditemukan`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      throw new NotFoundException(`Kategori dengan ID "${id}" tidak ditemukan`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
        const nameExists = await this.prisma.category.findUnique({ where: { name: updateCategoryDto.name } });
        if (nameExists && nameExists.id !== id) {
            throw new ConflictException('Nama kategori sudah ada');
        }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Kategori dengan ID "${id}" tidak ditemukan`);
    }

    return this.prisma.category.delete({ where: { id } });
  }
}