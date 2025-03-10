import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const GigCardSkeleton: React.FC = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-20" />
      </div>
    </CardHeader>
    <CardContent className="pb-2">
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-5/6" />

      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-2/5" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </CardContent>
    <CardFooter className="pt-2">
      <Skeleton className="h-9 w-full" />
    </CardFooter>
  </Card>
);
