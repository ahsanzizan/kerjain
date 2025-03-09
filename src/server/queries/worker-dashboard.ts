import { db } from "../db";

export const getWorkerDashboard = async (userId: string) => {
  const worker = await db.user.findUnique({
    where: { id: userId, role: "WORKER" },
    select: {
      applications: {
        select: {
          status: true,
          gig: {
            select: {
              id: true,
              pay: true,
              status: true,
            },
          },
        },
      },
      reviewsReceived: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (!worker) {
    throw new Error("Worker not found");
  }

  // Compute quick stats
  const totalJobsApplied = worker.applications.length;
  const jobsInProgress = worker.applications.filter(
    (a) => a.gig.status === "IN_PROGRESS",
  ).length;
  const completedJobs = worker.applications.filter(
    (a) => a.gig.status === "COMPLETED",
  ).length;
  const averageRating =
    worker.reviewsReceived.length > 0
      ? worker.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
        worker.reviewsReceived.length
      : null;

  // Compute chart data
  const appliedJobs = worker.applications.length;
  const acceptedJobs = worker.applications.filter(
    (a) => a.status === "ACCEPTED",
  ).length;

  // Compute earnings
  const completedEarnings = worker.applications
    .filter((a) => a.gig.status === "COMPLETED")
    .reduce((sum, a) => sum + a.gig.pay, 0);

  const ongoingEarnings = worker.applications
    .filter((a) => a.gig.status === "IN_PROGRESS")
    .reduce((sum, a) => sum + a.gig.pay, 0);

  return {
    quickStats: {
      totalJobsApplied,
      jobsInProgress,
      completedJobs,
      averageRating,
    },
    charts: {
      appliedVsAccepted: { appliedJobs, acceptedJobs },
      earnings: { completedEarnings, ongoingEarnings },
    },
  };
};
