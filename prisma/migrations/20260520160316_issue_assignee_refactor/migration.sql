/*
  Warnings:

  - You are about to drop the column `assignedToId` on the `Issue` table. All the data in the column will be lost.
  - Changed the type of `role` on the `OrganizationMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `organizationId` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'BILLING', 'ADMIN', 'MANAGER', 'MEMBER');

-- AlterEnum
ALTER TYPE "MemberRole" ADD VALUE 'LEAD';

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_assignedToId_fkey";

-- DropIndex
DROP INDEX "Issue_assignedToId_idx";

-- DropIndex
DROP INDEX "Issue_organizationId_assignedToId_idx";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "assignedToId";

-- AlterTable
ALTER TABLE "OrganizationMember" DROP COLUMN "role",
ADD COLUMN     "role" "OrganizationRole" NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "visibility" SET DEFAULT 'TEAM';

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "addedById" INTEGER,
ADD COLUMN     "joinedAt" TIMESTAMP(3),
ADD COLUMN     "organizationId" INTEGER NOT NULL,
ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "IssueAssignee" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IssueAssignee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IssueAssignee_issueId_idx" ON "IssueAssignee"("issueId");

-- CreateIndex
CREATE INDEX "IssueAssignee_userId_idx" ON "IssueAssignee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "IssueAssignee_issueId_userId_key" ON "IssueAssignee"("issueId", "userId");

-- CreateIndex
CREATE INDEX "TeamMember_organizationId_idx" ON "TeamMember"("organizationId");

-- CreateIndex
CREATE INDEX "TeamMember_addedById_idx" ON "TeamMember"("addedById");

-- CreateIndex
CREATE INDEX "TeamMember_organizationId_teamId_idx" ON "TeamMember"("organizationId", "teamId");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueAssignee" ADD CONSTRAINT "IssueAssignee_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueAssignee" ADD CONSTRAINT "IssueAssignee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueAssignee" ADD CONSTRAINT "IssueAssignee_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
