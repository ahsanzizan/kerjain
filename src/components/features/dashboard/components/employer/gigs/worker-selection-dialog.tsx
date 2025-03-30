"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Worker {
  id: string;
  name: string;
  image?: string;
  rating: number;
  completedGigs: number;
}

interface Application {
  id: string;
  gigId: string;
  workerId: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  worker: Worker;
}

interface Gig {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
}

interface WorkerSelectionDialogProps {
  gig: Gig;
  applications: Application[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkerSelect: (workerId: string, applicationId: string) => void;
}

export function WorkerSelectionDialog({
  gig,
  applications,
  open,
  onOpenChange,
  onWorkerSelect,
}: WorkerSelectionDialogProps) {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const pendingApplications = applications.filter(
    (app) => app.gigId === gig.id && app.status === "PENDING",
  );

  const handleSelectWorker = () => {
    if (selectedApplication) {
      onWorkerSelect(selectedApplication.worker.id, selectedApplication.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Pilih Pekerja</DialogTitle>
          <DialogDescription>
            Pilih satu pekerja untuk mengerjakan gig &quot;{gig.title}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>
              Hanya satu pekerja yang dapat dipilih untuk mengerjakan gig ini.
              Semua aplikasi lain akan otomatis ditolak.
            </AlertDescription>
          </Alert>

          {pendingApplications.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              Tidak ada aplikasi tertunda untuk gig ini
            </div>
          ) : (
            <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
              {pendingApplications.map((application) => (
                <div
                  key={application.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                    selectedApplication?.id === application.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={application.worker.image}
                          alt={application.worker.name}
                        />
                        <AvatarFallback>
                          {application.worker.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {application.worker.name}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Rating: {application.worker.rating} •{" "}
                          {application.worker.completedGigs} gig selesai
                        </div>
                      </div>
                    </div>
                    {selectedApplication?.id === application.id && (
                      <Badge className="bg-primary">Dipilih</Badge>
                    )}
                  </div>

                  <Separator className="my-3" />

                  <div className="text-sm">
                    <div className="mb-1 font-medium">Pesan Aplikasi:</div>
                    <div className="text-muted-foreground">
                      {application.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSelectWorker}
            disabled={!selectedApplication || pendingApplications.length === 0}
          >
            Pilih Pekerja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
