"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Prisma } from "@prisma/client";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CircleCheck,
  Clock,
  LogOut,
  MapPin,
  Star,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type FC, useState } from "react";

const WorkerProfile: FC<{
  profile: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      image: true;
      address: true;
      latitude: true;
      longitude: true;
      preferredRadius: true;
      jobPreferences: true;
      applications: {
        select: {
          id: true;
          status: true;
          gig: {
            select: {
              id: true;
              title: true;
              categories: true;
              employer: {
                select: { id: true; name: true; email: true };
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

  const { data: session } = useSession();

  // Calculate average rating
  const averageRating =
    profile.reviewsReceived.length > 0
      ? (
          profile.reviewsReceived.reduce(
            (sum, review) => sum + review.rating,
            0,
          ) / profile.reviewsReceived.length
        ).toFixed(1)
      : "Belum ada penilaian";

  // Count applications by status
  const applicationCounts = profile.applications.reduce(
    (acc, app) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, ACCEPTED: 0, REJECTED: 0 },
  );

  return (
    <PageContainer withFooter>
      <div className="bg-primary-50/30 container mx-auto max-w-6xl p-8">
        <Link
          href="/worker"
          className={buttonVariants({
            variant: "link",
            size: "link",
            className: "mb-8",
          })}
        >
          <ArrowLeft /> Kembali
        </Link>
        {/* Profile Header */}
        <div className="mb-6 flex flex-col gap-6 md:flex-row">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 ring-2 ring-primary-200">
              <AvatarImage src={profile.image!} alt={profile.name} />
              <AvatarFallback className="bg-primary-600 text-white">
                {profile.name?.charAt(0) || "W"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col justify-between md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-text-500">
                  {profile.name}
                </h1>
                <p className="text-primary-700">{profile.email}</p>
                {profile.address && (
                  <div className="mt-1 flex items-center text-primary-600/70">
                    <MapPin className="mr-1 h-4 w-4" />
                    <p>{profile.address}</p>
                  </div>
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
                  {profile.reviewsReceived.length} ulasan
                </p>
                <p className="text-sm text-primary-600/80">
                  Anggota sejak{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid grid-cols-4 bg-primary-100">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Profil Singkat
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Preferensi
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Lamaran ({profile.applications.length})
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-primary-600 data-[state=active]:text-white"
            >
              Ulasan ({profile.reviewsReceived.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-primary-200 bg-white shadow-sm">
                <CardHeader className="bg-primary-50 border-b border-primary-100 pb-2">
                  <CardTitle className="text-primary-800">Lamaran</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold text-primary-700">
                    {profile.applications.length}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(applicationCounts).map(
                      ([status, count]) => (
                        <Badge
                          key={status}
                          variant="outline"
                          className="border-primary-300 text-primary-700"
                        >
                          {status === "PENDING"
                            ? "TERTUNDA"
                            : status === "ACCEPTED"
                              ? "DITERIMA"
                              : status === "REJECTED"
                                ? "DITOLAK"
                                : status}
                          : {count}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-200 bg-white shadow-sm">
                <CardHeader className="bg-primary-50 border-b border-primary-100 pb-2">
                  <CardTitle className="text-primary-800">
                    Radius Kerja
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary-700" />
                    <p className="text-xl font-bold text-primary-700">
                      {profile.preferredRadius ?? "Belum ditentukan"}{" "}
                      {profile.preferredRadius ? "KM" : ""}
                    </p>
                  </div>
                  {profile.address && (
                    <p className="mt-2 text-sm text-text-500">
                      Dari:{" "}
                      <span className="text-primary-600/80">
                        {profile.address}
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary-200 bg-white shadow-sm">
                <CardHeader className="bg-primary-50 border-b border-primary-100 pb-2">
                  <CardTitle className="text-primary-800">Penilaian</CardTitle>
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
                <CardTitle className="text-primary-800">
                  Lamaran Terbaru
                </CardTitle>
                <CardDescription className="text-primary-600/70">
                  Pekerjaan yang baru-baru ini dilamar
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {profile.applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="border-b border-primary-100 pb-3 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-primary-800">
                          {app.gig.title}
                        </h3>
                        <Badge className="bg-primary-600">
                          {app.status === "PENDING"
                            ? "TERTUNDA"
                            : app.status === "ACCEPTED"
                              ? "DITERIMA"
                              : app.status === "REJECTED"
                                ? "DITOLAK"
                                : app.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-primary-600/80">
                        <span className="font-medium">Pemberi Kerja:</span>{" "}
                        {app.gig.employer.name}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-primary-300 text-primary-700"
                        >
                          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
                          {app.gig.categories.join(", ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-primary-200 bg-white shadow-sm">
              <CardHeader className="bg-primary-50 border-b border-primary-100">
                <CardTitle className="text-primary-800">
                  Preferensi Pekerjaan
                </CardTitle>
                <CardDescription className="text-primary-600/70">
                  Kategori dan jenis pekerjaan yang diminati
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {profile.jobPreferences ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium text-primary-800">
                        Kategori yang Disukai
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {typeof profile.jobPreferences === "object" &&
                          Array.isArray(profile.jobPreferences) &&
                          profile.jobPreferences.map((category, index) => (
                            <Badge
                              key={index}
                              className="bg-primary-100 text-primary-700 hover:bg-primary-200"
                            >
                              {category}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-primary-600">
                    Belum ada preferensi pekerjaan yang ditetapkan.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary-200 bg-white shadow-sm">
              <CardHeader className="bg-primary-50 border-b border-primary-100">
                <CardTitle className="text-primary-800">
                  Pengaturan Lokasi
                </CardTitle>
                <CardDescription className="text-primary-600/70">
                  Radius kerja dan informasi alamat
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 font-medium text-primary-800">
                      Alamat
                    </h3>
                    <p className="text-primary-700">
                      {profile.address ?? "Belum ditentukan"}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-1 font-medium text-primary-800">
                      Radius Kerja yang Disukai
                    </h3>
                    <p className="text-primary-700">
                      {profile.preferredRadius
                        ? `${profile.preferredRadius} kilometer`
                        : "Belum ditentukan"}
                    </p>
                  </div>

                  {profile.latitude && profile.longitude && (
                    <div>
                      <h3 className="mb-1 font-medium text-primary-800">
                        Koordinat
                      </h3>
                      <p className="text-primary-700">
                        {profile.latitude.toFixed(4)},{" "}
                        {profile.longitude.toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {profile.applications.length === 0 ? (
              <Card className="border-primary-200 bg-white shadow-sm">
                <CardContent className="pt-6 text-center text-primary-600">
                  <p>Belum ada lamaran yang diajukan.</p>
                </CardContent>
              </Card>
            ) : (
              profile.applications.map((app) => (
                <Card
                  key={app.id}
                  className="border-primary-200 bg-white shadow-sm"
                >
                  <CardHeader className="bg-primary-50 border-b border-primary-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-primary-800">
                          {app.gig.title}
                        </CardTitle>
                        <CardDescription className="text-primary-600/80">
                          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
                          {app.gig.categories.join(", ")}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`${
                          app.status === "ACCEPTED"
                            ? "bg-green-600"
                            : app.status === "REJECTED"
                              ? "bg-red-600"
                              : "bg-primary-600"
                        }`}
                      >
                        {app.status === "ACCEPTED" && (
                          <CircleCheck className="mr-1 h-3 w-3" />
                        )}
                        {app.status === "PENDING" && (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {app.status === "PENDING"
                          ? "TERTUNDA"
                          : app.status === "ACCEPTED"
                            ? "DITERIMA"
                            : app.status === "REJECTED"
                              ? "DITOLAK"
                              : app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center">
                      <BriefcaseBusiness className="mr-2 h-4 w-4 text-primary-600" />
                      <div>
                        <p className="text-sm font-medium text-primary-800">
                          {app.gig.employer.name}
                        </p>
                        <p className="text-xs text-primary-600/70">
                          {app.gig.employer.email}
                        </p>
                      </div>
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
                  <p>Belum ada ulasan.</p>
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
                      <Avatar className="h-10 w-10 ring-1 ring-primary-200">
                        <AvatarImage
                          src={review.reviewer.image!}
                          alt={review.reviewer.name}
                        />
                        <AvatarFallback className="bg-primary-600 text-white">
                          {review.reviewer.name?.charAt(0) || "R"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium text-primary-800">
                            {review.reviewer.name}
                          </h3>
                          <div className="flex items-center">
                            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-primary-500 text-primary-500" : "text-primary-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-primary-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {session?.user.id === profile.id && (
          <Button
            variant={"destructive"}
            onClick={() => signOut()}
            className="mt-8"
          >
            <LogOut /> Keluar
          </Button>
        )}
      </div>
    </PageContainer>
  );
};

export default WorkerProfile;
