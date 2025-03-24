import { type MilestoneStatus } from "@prisma/client";
import { CheckCircle, Circle } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  status: MilestoneStatus;
  completedByWorker: boolean;
}

interface MilestonesListProps {
  milestones: Milestone[];
}

export function MilestonesList({ milestones }: MilestonesListProps) {
  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="flex items-start">
          <div className="mr-4 flex h-7 w-7 items-center justify-center rounded-full border">
            {milestone.status === "COMPLETED" ? (
              <CheckCircle className="text-primary h-5 w-5" />
            ) : (
              <Circle className="text-muted-foreground h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{milestone.title}</p>
            <p className="text-muted-foreground text-sm">
              {milestone.status === "COMPLETED"
                ? "Completed"
                : milestone.completedByWorker
                  ? "Waiting for employer confirmation"
                  : "Not started"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
