import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { OrganizationsService } from "./organizations.service";

@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto, @Req() req: any) {
    return this.organizationsService.create(createOrganizationDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.organizationsService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.organizationsService.remove(+id);
  }
}
