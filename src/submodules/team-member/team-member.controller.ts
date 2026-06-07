import { Controller, Get, Post, Body, Patch, Param, Delete, Request,  } from "@nestjs/common";
import { TeamMemberService } from "./team-member.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";

@Controller("teams/members")
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

  @Post("add")
  create(@Body() createTeamMemberDto: CreateTeamMemberDto, @Request() req: Request) {
    return this.teamMemberService.create(createTeamMemberDto, req);
  }

  @Get("get")
  findAll() {
    return this.teamMemberService.findAll();
  }

  @Delete("remove/:id")
  remove(@Param("id") id: string) {
    return this.teamMemberService.remove(+id);
  }
}
