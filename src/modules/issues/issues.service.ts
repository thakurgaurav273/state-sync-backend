import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { connect } from "http2";

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}
  async create(createIssueDto: CreateIssueDto, userId: number) {
    const issue = await this.prisma.$transaction(async (tx) => {
      const team = await tx.team.findUnique({
        where: { id: createIssueDto.teamId },
      });

      if (!team) {
        throw new HttpException("Team not found", 404);
      }
      const updatedTeam = await tx.team.update({
        where: { id: createIssueDto.teamId },
        data: {
          issueCounter: {
            increment: 1,
          },
        },
      });

      const issueKey = `${updatedTeam.code}-${updatedTeam.issueCounter}`;

      const data: any = {
        title: createIssueDto.title,
        description: createIssueDto.description,
        issueId: issueKey,

        createdBy: {
          connect: {
            id: userId,
          },
        },

        ...(createIssueDto.assignedToId ? {
          assignees: {
            create: {
              userId: Number(createIssueDto.assignedToId),
            },
          },
        } : {}),

        team: {
          connect: {
            id: createIssueDto.teamId,
          },
        },

        organization: {
          connect: {
            id: createIssueDto.organizationId,
          },
        },
      };

      if (createIssueDto.projectId) {
        data.project = {
          connect: {
            id: createIssueDto.projectId,
          },
        };
      }

      const issue = await tx.issue.create({
        data,
      });

      await tx.issueActivity.create({
        data: {
          issueId: issue.id,
          userId: userId,
          action: "created",
          metadata: {
            title: issue.title || "",
          },
        },
      });

      return issue;
    });
    return issue;
  }

  async findAll(organizationId: number) {
    try {
      const issues = await this.prisma.issue.findMany({
        where: {
          organizationId,
        },
        include: {
          team: true,
          project: true,
          labels: {
            include: {
              label: true,
            },
          },
          assignees: {
            include: {
              user: true,
            },
          },
          attachments: true,
        },
      });
      return issues.map((issue) => ({
        ...issue,
        labels: issue.labels.map((item) => item.label),
      }));
    } catch (error) {
      console.error("Error finding all issues:", error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const issue = await this.prisma.issue.findUnique({
        where: { issueId: id },
      });
      if (!issue) {
        throw new HttpException("Issue not found", 404);
      }
      return issue;
    } catch (error) {
      console.error("Error finding issue:", error);
      throw error;
    }
  }

  async update(id: string, updateIssueDto: UpdateIssueDto, userId: number) {
    try {
      const issue = await this.prisma.issue.findUnique({
        where: { issueId: id },
        include: { assignees: true },
      });
      if (!issue) {
        throw new Error("Issue not found");
      }

      const { assignedToId, ...restData } = updateIssueDto;
      const dataToUpdate: any = { ...restData };
      const currentAssigneeId = issue.assignees[0]?.userId;

      if (assignedToId !== undefined && assignedToId !== currentAssigneeId) {
        dataToUpdate.assignees = {
          deleteMany: {},
          ...(assignedToId ? {
            create: {
              userId: assignedToId,
            },
          } : {}),
        };
      }

      const updatedIssue = await this.prisma.issue.update({
        where: { issueId: id },
        data: dataToUpdate,
      });

      const changes: string[] = [];
      if (updateIssueDto.status && updateIssueDto.status !== issue.status) {
        changes.push(`changed status to ${updateIssueDto.status}`);
      }
      if (updateIssueDto.priority && updateIssueDto.priority !== issue.priority) {
        changes.push(`changed priority to ${updateIssueDto.priority}`);
      }
      if (
        assignedToId !== undefined &&
        assignedToId !== currentAssigneeId
      ) {
        changes.push(`updated the assignee`);
      }

      if (changes.length > 0) {
        await this.prisma.issueActivity.create({
          data: {
            issueId: issue.id,
            userId: userId,
            action: changes.join(", "),
            metadata: {
              prevStatus: issue.status,
              newStatus: updateIssueDto.status,
              prevAssignee: currentAssigneeId,
              newAssignee: assignedToId,
            },
          },
        });
      }

      return updatedIssue;
    } catch (error) {
      console.error("Error updating issue:", error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const issue = await this.prisma.issue.findUnique({
        where: { id },
      });
      if (!issue) {
        throw new HttpException("Issue not found", 404);
      }
      await this.prisma.issue.delete({
        where: { id },
      });
      return {
        message: `Issue with id: ${id} deleted successfully`,
      };
    } catch (error) {
      console.error("Error removing issue:", error);
      throw error;
    }
  }
}
