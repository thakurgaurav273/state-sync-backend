import { Injectable } from '@nestjs/common';
import { CreateOrgMemberDto } from './dto/create-org-member.dto';
import { UpdateOrgMemberDto } from './dto/update-org-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrgMemberService {
  constructor(private prismaService: PrismaService) {}
  create(createOrgMemberDto: CreateOrgMemberDto) {
    const { organizationId, userId, role, status, invitedById, removedAt } = createOrgMemberDto;
    return this.prismaService.organizationMember.create({
      data: {
        organizationId,
        userId,
        role,
        status,
        invitedBy: invitedById,
        removedAt: removedAt ? new Date(removedAt) : undefined,
      },
    });
  }

  findAll() {
    return this.prismaService.organizationMember.findMany();
  }

  findOne(id: number) {
    return this.prismaService.organizationMember.findUnique({
      where: { id },
    });
  }

  update(id: number, updateOrgMemberDto: UpdateOrgMemberDto) {
    return this.prismaService.organizationMember.update({
      where: { id },
      data: updateOrgMemberDto,
    });
  }

  remove(id: number) {
    return this.prismaService.organizationMember.delete({
      where: { id },
    });
  }
}
