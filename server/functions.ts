import { generateIssuesForClient } from "@/utils/helpers";

import {
  defaultUsers,
  generateInitialUserComments,
  generateInitialUserIssues,
  generateInitialUserSprints,
} from "../prisma/seed-data";
import { prisma } from "./db";
import { DefaultUser, SprintStatus } from "@prisma/client";

export async function getInitialIssuesFromServer(
  userId: DefaultUser["id"] | undefined | null,
  projectId: number
) {
  let activeIssues = await prisma.issue.findMany({
    where: {
      isDeleted: false,
      creatorId: userId ?? "init",
      projectId: projectId,
    },
  });

  // if (userId && (!activeIssues || activeIssues.length === 0)) {
  //   // New user, create default issues
  //   await initDefaultIssues(userId);
  //   // Create comments for default issues
  //   await initDefaultIssueComments(userId);

  //   const newActiveIssues = await prisma.issue.findMany({
  //     where: {
  //       creatorId: userId,
  //       isDeleted: false,
  //       projectId: projectId,
  //     },
  //   });
  //   activeIssues = newActiveIssues;
  // }

  if (!activeIssues || activeIssues.length === 0) {
    return [];
  }

  const activeSprints = await prisma.sprint.findMany({
    where: {
      projectId: projectId,
      status: "ACTIVE",
    },
  });

  const userIds = activeIssues
    .flatMap((issue) => [issue.assigneeId, issue.reporterId] as string[])
    .filter(Boolean);

  // USE THIS IF RUNNING LOCALLY ----------------------
  const users = await prisma.defaultUser.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  const issues = generateIssuesForClient(
    activeIssues,
    users,
    activeSprints.map((sprint) => sprint.id)
  );
  return issues;
}

export async function getInitialProjectFromServer() {
  const project = await prisma.project.findUnique({
    where: { key: "JIRA-CLONE" },
  });
  // set projectId in clone tobedone
  return project;
}

export async function getInitialSprintsFromServer(
  userId: DefaultUser["id"] | undefined,
  projectId: number
) {
  let sprints = await prisma.sprint.findMany({
    where: {
      OR: [{ status: SprintStatus.ACTIVE }, { status: SprintStatus.PENDING }],
      creatorId: userId ?? "init",
      projectId: projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // if (userId && (!sprints || sprints.length === 0)) {
  //   // New user, create default sprints
  //   await initDefaultSprints(userId);

  //   const newSprints = await prisma.sprint.findMany({
  //     where: {
  //       creatorId: userId,
  //       projectId: projectId,
  //     },
  //   });
  //   sprints = newSprints;
  // }
  return sprints;
}

export async function initProject() {
  await prisma.project.upsert({
    where: {
      id: "init-project-id-dq8yh-d0as89hjd",
    },
    update: {},
    create: {
      id: "init-project-id-dq8yh-d0as89hjd",
      name: "F2 Fin Operations",
      key: "JIRA-CLONE",
    },
  });
}
export async function initDefaultUsers() {
  await Promise.all(
    defaultUsers.map(
      async (user) =>
        await prisma.defaultUser.upsert({
          where: {
            id: user.id,
          },
          update: {
            avatar: user.avatar,
          },
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
        })
    )
  );
}
export async function initDefaultProjectMembers(projectId: number) {
  await Promise.all(
    defaultUsers.map(
      async (user) =>
        await prisma.member.upsert({
          where: {
            id: user.id,
          },
          update: {},
          create: {
            id: user.id,
            projectId: projectId,
          },
        })
    )
  );
}

export async function initDefaultIssues(userId: string) {
  const initialIssues = generateInitialUserIssues(userId);
  await Promise.all(
    initialIssues.map(
      async (issue) =>
        await prisma.issue.upsert({
          where: {
            id: issue.id,
          },
          update: {},
          create: {
            ...issue,
          },
        })
    )
  );
}

export async function initDefaultIssueComments(userId: string) {
  const initialComments = generateInitialUserComments(userId);
  await Promise.all(
    initialComments.map(
      async (comment) =>
        await prisma.comment.upsert({
          where: {
            id: comment.id,
          },
          update: {},
          create: {
            ...comment,
          },
        })
    )
  );
}

export async function initDefaultSprints(userId: string) {
  const initialSprints = generateInitialUserSprints(userId);
  await Promise.all(
    initialSprints.map(
      async (sprint) =>
        await prisma.sprint.upsert({
          where: {
            id: sprint.id,
          },
          update: {},
          create: {
            ...sprint,
          },
        })
    )
  );
}
