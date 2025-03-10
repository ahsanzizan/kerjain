import { db } from "../db";

export const getEmployerDashboard = async (userId: string) => {
  const employer = await db.user.findUnique({
    where: { id: userId, role: "EMPLOYER" },
    select: {
      postedGigs: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          applications: { select: { id: true, createdAt: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
  });

  if (!employer) {
    throw new Error("Employer not found");
  }

  // Compute quick stats
  const totalGigsPosted = employer.postedGigs.length;
  const totalApplications = employer.postedGigs.reduce(
    (sum, gig) => sum + gig.applications.length,
    0,
  );

  const gigStatusCount = {
    OPEN: employer.postedGigs.filter((gig) => gig.status === "OPEN").length,
    IN_PROGRESS: employer.postedGigs.filter(
      (gig) => gig.status === "IN_PROGRESS",
    ).length,
    COMPLETED: employer.postedGigs.filter((gig) => gig.status === "COMPLETED")
      .length,
    CANCELED: employer.postedGigs.filter((gig) => gig.status === "CANCELED")
      .length,
  };

  const totalRatings = employer.postedGigs.reduce(
    (sum, gig) => sum + gig.reviews.length,
    0,
  );
  const averageRating =
    totalRatings > 0
      ? employer.postedGigs.reduce(
          (sum, gig) => sum + gig.reviews.reduce((s, r) => s + r.rating, 0),
          0,
        ) / totalRatings
      : null;

  // Compute applications trend (grouping per week/month)
  const applicationsTrend = employer.postedGigs
    .flatMap((gig) => gig.applications)
    .map((app) => ({
      date: app.createdAt.toISOString().split("T")[0], // Format date (YYYY-MM-DD)
    }));

  // Compute performance of completed gigs
  const completedGigPerformance = employer.postedGigs
    .filter((gig) => gig.status === "COMPLETED")
    .map((gig) => ({
      gigId: gig.id,
      applications: gig.applications.length,
      rating:
        gig.reviews.length > 0
          ? gig.reviews.reduce((sum, r) => sum + r.rating, 0) /
            gig.reviews.length
          : null,
    }));

  return {
    quickStats: {
      totalGigsPosted,
      totalApplications,
      gigStatusCount,
      averageRating,
    },
    charts: {
      applicationsTrend,
      completedGigPerformance,
    },
  };
};
