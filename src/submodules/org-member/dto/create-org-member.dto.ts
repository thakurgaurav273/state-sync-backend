import { MemberStatus, OrganizationRole } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateOrgMemberDto {
  @IsInt()
  organizationId: number;

  @IsInt()
  userId: number;

  @IsEnum(OrganizationRole)
  role: OrganizationRole;

  @IsEnum(MemberStatus)
  status: MemberStatus;

  @IsOptional()
  @IsInt()
  invitedById: number | null | undefined;

  @IsOptional()
  @IsString()
  removedAt: string | null | undefined;
}
