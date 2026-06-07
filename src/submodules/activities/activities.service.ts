import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}
  create(createActivityDto: CreateActivityDto) {
    return this.prisma.issueActivity.create({
      data: createActivityDto,
    });
  }

  findAll() {
    return this.prisma.issueActivity.findMany();
  }

  async findInvolvingUser(userId: number) {
    return this.prisma.issueActivity.findMany({
      where: {
        OR: [
          { userId: userId },
          {
            issue: {
              OR: [
                { assignees: { some: { userId: userId } } },
                { createdById: userId },
              ],
            },
          },
        ],
      },
      include: {
        issue: {
          include: {
            assignees: {
              include: { user: true },
            },
            createdBy: true,
            team: true,
            project: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  findOne(id: number) {
    return this.prisma.issueActivity.findUnique({
      where: { id },
    });
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return this.prisma.issueActivity.update({
      where: { id },
      data: updateActivityDto,
    });
  }

  remove(id: number) {
    return this.prisma.issueActivity.delete({
      where: { id },
    });
  }
}
