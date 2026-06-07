import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { MemberRole, MemberStatus } from "@prisma/client";

export class CreateTeamMemberDto {
  @IsNotEmpty()
  @IsInt()
  teamId: number;

  @IsNotEmpty()
  @IsInt()
  organizationId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsEnum(MemberRole)
  role: MemberRole;

  @IsInt()
  @IsOptional()
  addedById?: number;

  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus;
}
