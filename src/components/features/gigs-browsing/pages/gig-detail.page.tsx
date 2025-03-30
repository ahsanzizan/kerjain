import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Clock, DollarSign, MapPin, Tag, User } from "lucide-react";
import { notFound } from "next/navigation";

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
import { formatDate, formatRupiah } from "@/lib/utils";
import { db } from "@/server/db";
import { ApplicationSubmission } from "../components/application-submission";
import { GigStatusBadge } from "../components/gig-status-badge";
import { MilestonesList } from "../components/milestones-list";

export async function getGigDetails(id: string) {
  const gig = await db.gig.findUnique({
    where: { id },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          image: true,
          reviewsReceived: {
            select: {
              rating: true,
            },
          },
        },
      },
      applications: true,
      milestones: true,
    },
  });

  if (!gig) {
    return null;
  }

  const reviewCount = gig.employer.reviewsReceived.length;
  const averageRating =
    reviewCount > 0
      ? gig.employer.reviewsReceived.reduce(
          (sum, review) => sum + review.rating,
          0,
        ) / reviewCount
      : null;

  return {
    id: gig.id,
    title: gig.title,
    description: gig.description,
    latitude: gig.latitude,
    longitude: gig.longitude,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    address: gig.address,
    pay: gig.pay,
    deadline: gig.deadline,
    status: gig.status,
    categories: gig.categories,
    createdAt: gig.createdAt,
    employer: {
      id: gig.employer.id,
      name: gig.employer.name,
      image: gig.employer.image ?? "/placeholder.svg?height=40&width=40",
      reviewCount,
      averageRating,
    },
    applications: {
      count: gig.applications.length,
      userHasApplied: gig.applications.some(
        (app) => app.workerId === "currentUserId",
      ),
      userApplicationStatus:
        gig.applications.find((app) => app.workerId === "currentUserId")
          ?.status ?? null,
    },
    milestones: gig.milestones.map((milestone) => ({
      id: milestone.id,
      gigId: milestone.gigId,
      createdAt: milestone.createdAt,
      title: milestone.title,
      status: milestone.status,
      completedByWorker: milestone.completedByWorker,
    })),
  };
}

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gig = await getGigDetails(id);

  if (!gig) {
    return notFound();
  }

  const daysLeft = Math.ceil(
    (gig.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <PageContainer withFooter>
      <div className="container mx-auto max-w-5xl py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Konten utama - 2/3 lebar pada desktop */}
          <div className="space-y-6 md:col-span-2">
            {/* Header Pekerjaan */}
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                  {gig.title}
                </h1>
                <GigStatusBadge status={gig.status} />
              </div>
              <div className="text-muted-foreground mt-2 flex items-center text-sm">
                <Clock className="mr-1 h-4 w-4" />
                <span>
                  Diposting {formatDate(gig.createdAt)} (
                  {formatDistanceToNow(gig.createdAt, { addSuffix: true })})
                </span>
              </div>
            </div>

            {/* Detail Pekerjaan */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p>{gig.description}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center">
                    <MapPin className="text-muted-foreground mr-2 h-5 w-5" />
                    <span>{gig.address}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-muted-foreground mr-2 h-5 w-5" />
                    <span>{formatRupiah(gig.pay)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-muted-foreground mr-2 h-5 w-5" />
                    <span>
                      Batas waktu {format(gig.deadline, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="text-muted-foreground mr-2 h-5 w-5" />
                    <span>{gig.applications.count} pelamar</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Kategori</h4>
                  <div className="flex flex-wrap gap-2">
                    {gig.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        <Tag className="mr-1 h-3 w-3" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestone */}
            <Card>
              <CardHeader>
                <CardTitle>Milestone</CardTitle>
                <CardDescription>
                  Pekerjaan akan selesai ketika semua milestone selesai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MilestonesList milestones={gig.milestones} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 lebar pada desktop */}
          <div className="space-y-6">
            {/* Status Aplikasi/Tombol */}
            <Card>
              <CardHeader>
                <CardTitle>Aplikasi</CardTitle>
              </CardHeader>
              <CardContent>
                {gig.applications.userHasApplied ? (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="font-medium">Status aplikasi Anda:</p>
                      <Badge
                        className="mt-2"
                        variant={
                          gig.applications.userApplicationStatus === "ACCEPTED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {gig.applications.userApplicationStatus}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-600">
                        <Clock className="mr-1 h-4 w-4" />
                        <span className="text-sm font-medium">
                          {daysLeft} hari tersisa untuk melamar
                        </span>
                      </div>
                    </div>
                    <ApplicationSubmission gigId={gig.id} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Pemberi Pekerjaan */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Pemberi Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={gig.employer.image}
                      alt={gig.employer.name}
                    />
                    <AvatarFallback>
                      {gig.employer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{gig.employer.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
