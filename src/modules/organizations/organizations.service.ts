import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}
  async create(createOrganizationDto: CreateOrganizationDto, userId: number) {
    try {
      const organization = await this.prisma.organization.create({
        data: {
          ...createOrganizationDto,
          members: {
            create: {
              userId,
              role: "OWNER",
              status: "ACTIVE",
            },
          },
        },
      });
      return organization;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  }

  async findAll(userId: number) {
    try {
      const organizations = await this.prisma.organization.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
      });
      return organizations;
    } catch (err) {
      console.error("Error finding all organizations:", err);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { id },
      });

      if (!organization) {
        throw new HttpException("Organization not found", 404);
      }
      return organization;
    } catch (err) {
      console.error("Error finding organization:", err);
      throw new HttpException(err.message, 400);
    }
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      const organization = await this.prisma.organization.update({
        where: { id },
        data: updateOrganizationDto,
      });
      return organization;
    } catch (err) {
      console.error("Error updating organization:", err);
      throw new HttpException("Organization not found", 404);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.organization.delete({
        where: { id },
      });
    } catch (err) {
      console.error("Error removing organization:", err);
      throw new HttpException("Organization not found", 404);
    }
  }
}
