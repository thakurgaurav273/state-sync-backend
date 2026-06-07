import { Injectable } from "@nestjs/common";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { TeamMember } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivitiesService } from "../activities/activities.service";
import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from "@nestjs/common";

@Injectable()
export class TeamMemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activitiesService: ActivitiesService
  ) {}

  create(createTeamMemberDto: CreateTeamMemberDto, req: Request) {
    const { teamId, userId, role, addedById, organizationId, status } = createTeamMemberDto;
    
    return this.prisma.$transaction(async (tx) => {
      const teamMember = await tx.teamMember.create({
        data: {
          teamId,
          userId,
          role,
          addedById,
          organizationId,
          status,
        },
      });

      const roleName = role === "ADMIN" ? "ADMIN" : "MEMBER";
      await this.activitiesService.create({
        action: "",
        issueId: teamId,
        userId: userId,
        metadata: {
          teamId,
          roleName,
        },
      });

      return teamMember;
    });
  }

  findAll() {
    return `This action returns all teamMember`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamMember`;
  }

  update(id: number, updateTeamMemberDto: UpdateTeamMemberDto) {
    return `This action updates a #${id} teamMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamMember`;
  }
}
