import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsInt()
  issueCounter: number;

  @IsInt()
  organizationId: number;

  @IsInt()
  createdById: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  iconColor?: string;
}
