import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatRupiah } from "@/lib/utils";
import { type GigStatus } from "@prisma/client";
import { Calendar, DollarSign, Tag } from "lucide-react";
import { type GigCardProps } from "../types";

export const GigCard: React.FC<GigCardProps> = ({ gig, onViewDetails }) => {
  const getStatusBadgeVariant = (
    status: GigStatus,
  ): "secondary" | "outline" | "default" | "destructive" => {
    switch (status) {
      case "OPEN":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "COMPLETED":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: GigStatus) => {
    switch (status) {
      case "OPEN":
        return "Terbuka";
      case "IN_PROGRESS":
        return "Sedang Berlangsung";
      case "COMPLETED":
        return "Selesai";
      default:
        return status;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{gig.title}</CardTitle>
          <Badge variant={getStatusBadgeVariant(gig.status)}>
            {getStatusLabel(gig.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="mb-4 text-sm text-gray-500">{gig.description}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="text-gray-400" size={16} />
            <span className="font-medium">{formatRupiah(gig.pay)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400" size={16} />
            <span className="text-sm">Tenggat: {formatDate(gig.deadline)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="text-gray-400" size={16} />
            <div className="flex flex-wrap gap-1">
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
              {gig.categories.map((cat, index) => (
                <Badge
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full" onClick={() => onViewDetails(gig.id)}>
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  );
};
