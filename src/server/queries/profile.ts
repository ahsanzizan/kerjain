import { db } from "../db";

export const getEmployerProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId, role: "EMPLOYER" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      address: true,
      postedGigs: {
        select: {
          id: true,
          title: true,
          description: true,
          categories: true,
          pay: true,
          status: true,
          applications: {
            select: {
              id: true,
              status: true,
              worker: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
        },
      },
      reviewsReceived: {
        select: {
          id: true,
          rating: true,
          comment: true,
          reviewer: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const getWorkerProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId, role: "WORKER" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      address: true,
      latitude: true,
      longitude: true,
      preferredRadius: true,
      jobPreferences: true,
      applications: {
        select: {
          id: true,
          status: true,
          gig: {
            select: {
              id: true,
              title: true,
              categories: true,
              employer: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      },
      reviewsReceived: {
        select: {
          id: true,
          rating: true,
          comment: true,
          reviewer: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
