import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgMemberDto } from './create-org-member.dto';

export class UpdateOrgMemberDto extends PartialType(CreateOrgMemberDto) {}
