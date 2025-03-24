import { Badge } from "@/components/ui/badge";

type GigStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";

interface GigStatusBadgeProps {
  status: GigStatus;
}

export function GigStatusBadge({ status }: GigStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "OPEN":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "COMPLETED":
        return "success";
      case "CANCELED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    <Badge variant={getVariant() as any}>{status.replace("_", " ")}</Badge>
  );
}
