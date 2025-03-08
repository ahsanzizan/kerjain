"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Prisma } from "@prisma/client";
import { Star } from "lucide-react";
import { type FC, useState } from "react";

const EmployerProfile: FC<{
  profile: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      image: true;
      address: true;
      postedGigs: {
        select: {
          id: true;
          title: true;
          description: true;
          category: true;
          pay: true;
          status: true;
          applications: {
            select: {
              id: true;
              status: true;
              worker: {
                select: { id: true; name: true; email: true; image: true };
              };
            };
          };
        };
      };
      reviewsReceived: {
        select: {
          id: true;
          rating: true;
          comment: true;
          reviewer: {
            select: { id: true; name: true; image: true };
          };
        };
      };
      createdAt: true;
      updatedAt: true;
    };
  }>;
}> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate average rating
  const averageRating =
    profile.reviewsReceived.length > 0
      ? (
          profile.reviewsReceived.reduce(
            (sum, review) => sum + review.rating,
            0,
          ) / profile.reviewsReceived.length
        ).toFixed(1)
      : "No ratings yet";

  // Count applications by status
  const applicationCounts = profile.postedGigs.reduce(
    (acc, gig) => {
      gig.applications.forEach((app) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acc[app.status] = (acc[app.status] || 0) + 1;
      });
      return acc;
    },
    { PENDING: 0, ACCEPTED: 0, REJECTED: 0 },
  );

  return (
    <PageContainer withFooter>
      <div className="bg-primary-50/30 container mx-auto max-w-6xl p-8">
        {/* Profile Header */}
        <div className="mb-6 flex flex-col gap-6 md:flex-row">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 ring-2 ring-primary-200">
              <AvatarImage src={profile.image!} alt={profile.name} />
              <AvatarFallback className="bg-primary-600 text-white">
                {profile.name?.charAt(0) || "E"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col justify-between md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-text-500">
                  {profile.name}
                </h1>
                <p className="text-text-500">{profile.email}</p>
                {profile.address && (
                  <p className="text-text-400">{profile.address}</p>
                )}
              </div>

              <div className="mt-4 flex flex-col items-start md:mt-0 md:items-end">
                {profile.reviewsReceived.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-primary-900">
                      {averageRating}
                    </span>
                    <Star className="h-5 w-5 fill-primary-500 text-primary-500" />
                  </div>
                )}
                <p className="text-sm text-primary-600/80">
                  {profile.reviewsReceived.length} reviews
                </p>
                <p className="text-sm text-primary-600/80">
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid grid-cols-3 bg-primary-100">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="gigs"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Gigs ({profile.postedGigs.length})
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Reviews ({profile.reviewsReceived.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-primary-200 bg-white shadow-sm">
                <CardHeader className="bg-primary-50 border-b border-primary-100 pb-2">
                  <CardTitle className="text-primary-800">
                    Posted Gigs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold text-primary-700">
                    {profile.postedGigs.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary-200 bg-white shadow-sm">
                <CardHeader className="bg-primary-50 border-b border-primary-100 pb-2">
                  <CardTitle className="text-primary-800">
                    Received Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold text-primary-700">
                    {profile.postedGigs.reduce(
                      (sum, gig) => sum + gig.applications.length,
                      0,
                    )}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(applicationCounts).map(
                      ([status, count]) => (
                        <Badge
                          key={status}
                          variant="outline"
                          className="border-primary-300 text-primary-700"
                        >
                          {status}: {count}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-200 bg-white shadow-sm">
                <CardHeader className="bg-primary-50 border-b border-primary-100 pb-2">
                  <CardTitle className="text-primary-800">Rating</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-1">
                    <p className="text-3xl font-bold text-primary-700">
                      {averageRating}
                    </p>
                    {typeof averageRating === "string" ? null : (
                      <Star className="h-6 w-6 fill-primary-500 text-primary-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent activity */}
            <Card className="border-primary-200 bg-white shadow-sm">
              <CardHeader className="bg-primary-50 border-b border-primary-100">
                <CardTitle className="text-primary-800">Recent Gigs</CardTitle>
                <CardDescription className="text-primary-600/70">
                  Recently posted gigs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {profile.postedGigs.slice(0, 3).map((gig) => (
                    <div
                      key={gig.id}
                      className="border-b border-primary-100 pb-3 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-primary-800">
                          {gig.title}
                        </h3>
                        <Badge className="bg-primary-600">{gig.status}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-primary-600/80">
                        {gig.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-primary-300 text-primary-700"
                        >
                          {gig.category}
                        </Badge>
                        <span className="text-sm font-medium text-primary-700">
                          ${gig.pay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gigs Tab */}
          <TabsContent value="gigs" className="space-y-6">
            {profile.postedGigs.length === 0 ? (
              <Card className="border-primary-200 bg-white shadow-sm">
                <CardContent className="pt-6 text-center text-primary-600">
                  <p>No gigs posted yet.</p>
                </CardContent>
              </Card>
            ) : (
              profile.postedGigs.map((gig) => (
                <Card
                  key={gig.id}
                  className="border-primary-200 bg-white shadow-sm"
                >
                  <CardHeader className="bg-primary-50 border-b border-primary-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-primary-800">
                          {gig.title}
                        </CardTitle>
                        <CardDescription className="text-primary-600/80">
                          {gig.category}
                        </CardDescription>
                      </div>
                      <Badge className="bg-primary-600">{gig.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="mb-3 text-primary-700">{gig.description}</p>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="font-medium text-primary-800">Pay:</span>
                      <span className="text-primary-700">${gig.pay}</span>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium text-primary-800">
                        Applications ({gig.applications.length})
                      </h4>
                      {gig.applications.length === 0 ? (
                        <p className="text-sm text-primary-600/70">
                          No applications yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {gig.applications.map((app) => (
                            <div
                              key={app.id}
                              className="bg-primary-50 flex items-center justify-between rounded p-2"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 ring-1 ring-primary-200">
                                  <AvatarImage
                                    src={app.worker.image!}
                                    alt={app.worker.name}
                                  />
                                  <AvatarFallback className="bg-primary-600 text-white">
                                    {app.worker.name?.charAt(0) || "W"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium text-primary-800">
                                    {app.worker.name}
                                  </p>
                                  <p className="text-xs text-primary-600/70">
                                    {app.worker.email}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="border-primary-300 text-primary-700"
                              >
                                {app.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {profile.reviewsReceived.length === 0 ? (
              <Card className="border-primary-200 bg-white shadow-sm">
                <CardContent className="pt-6 text-center text-primary-600">
                  <p>No reviews yet.</p>
                </CardContent>
              </Card>
            ) : (
              profile.reviewsReceived.map((review) => (
                <Card
                  key={review.id}
                  className="border-primary-200 bg-white shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 ring-1 ring-blue-200">
                        <AvatarImage
                          src={review.reviewer.image!}
                          alt={review.reviewer.name}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {review.reviewer.name?.charAt(0) || "R"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium text-blue-800">
                            {review.reviewer.name}
                          </h3>
                          <div className="flex items-center">
                            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-blue-500 text-blue-500" : "text-blue-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-blue-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default EmployerProfile;
