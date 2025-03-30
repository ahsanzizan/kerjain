"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle2, Clock } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Milestone {
  id: string;
  title: string;
  status: "PENDING" | "COMPLETED";
  completedByWorker: boolean;
}

interface Gig {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  pay: number;
  deadline: string;
  applications: number;
  description?: string;
  address?: string;
  categories?: string[];
  worker?: {
    id: string;
    name: string;
    image?: string;
  } | null;
}

interface GigDetailDialogProps {
  gig: Gig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for milestones
const mockMilestones: Milestone[] = [
  {
    id: "milestone_1",
    title: "Analisis kebutuhan dan perencanaan",
    status: "COMPLETED",
    completedByWorker: true,
  },
  {
    id: "milestone_2",
    title: "Desain wireframe dan mockup",
    status: "COMPLETED",
    completedByWorker: true,
  },
  {
    id: "milestone_3",
    title: "Pengembangan frontend",
    status: "PENDING",
    completedByWorker: true,
  },
  {
    id: "milestone_4",
    title: "Pengembangan backend dan integrasi API",
    status: "PENDING",
    completedByWorker: false,
  },
  {
    id: "milestone_5",
    title: "Testing dan deployment",
    status: "PENDING",
    completedByWorker: false,
  },
];

// Mock data for messages
const mockMessages = [
  {
    id: "msg_1",
    sender: "worker",
    text: "Saya sudah menyelesaikan analisis kebutuhan dan perencanaan. Mohon untuk direview.",
    timestamp: "2025-03-20T10:30:00",
  },
  {
    id: "msg_2",
    sender: "employer",
    text: "Terima kasih, saya sudah mereview dan setuju dengan perencanaan yang dibuat.",
    timestamp: "2025-03-20T14:15:00",
  },
  {
    id: "msg_3",
    sender: "worker",
    text: "Saya sudah menyelesaikan desain wireframe dan mockup. Silakan dicek.",
    timestamp: "2025-03-25T09:45:00",
  },
  {
    id: "msg_4",
    sender: "employer",
    text: "Desainnya bagus, ada beberapa revisi kecil yang saya kirimkan via email.",
    timestamp: "2025-03-25T11:20:00",
  },
  {
    id: "msg_5",
    sender: "worker",
    text: "Saya sudah mengerjakan revisi dan sekarang sedang mengerjakan frontend.",
    timestamp: "2025-03-27T16:05:00",
  },
];

export function GigDetailDialog({
  gig,
  open,
  onOpenChange,
}: GigDetailDialogProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [milestones, setMilestones] = useState(mockMilestones);

  const completedMilestones = milestones.filter(
    (m) => m.status === "COMPLETED",
  ).length;
  const totalMilestones = milestones.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: `msg_${messages.length + 1}`,
        sender: "employer",
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleApproveMilestone = (milestoneId: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "COMPLETED" as const } : m,
      ),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{gig.title}</DialogTitle>
          <DialogDescription>
            Detail progres gig yang sedang berlangsung
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={gig.worker?.image} alt={gig.worker?.name} />
                <AvatarFallback>
                  {gig.worker?.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {gig.worker?.name ?? "Belum ada pekerja"}
                </div>
                <div className="text-muted-foreground text-sm">Pekerja</div>
              </div>
            </div>
            <Badge className="bg-blue-500 hover:bg-blue-600">
              Dalam Proses
            </Badge>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                Progres: {completedMilestones} dari {totalMilestones} milestone
              </span>
              <span className="text-sm font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Tabs defaultValue="milestones">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="milestones">Milestone</TabsTrigger>
              <TabsTrigger value="messages">Pesan</TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="mt-4 space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{milestone.title}</div>
                      <div className="text-muted-foreground text-sm">
                        {milestone.status === "COMPLETED"
                          ? "Selesai"
                          : "Belum selesai"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {milestone.status === "COMPLETED" ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="text-sm">Selesai</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Milestone ini telah selesai</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : milestone.completedByWorker ? (
                      <Button
                        size="sm"
                        onClick={() => handleApproveMilestone(milestone.id)}
                      >
                        Setujui
                      </Button>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-amber-600">
                              <Clock className="h-5 w-5" />
                              <span className="text-sm">Menunggu</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Menunggu pekerja menyelesaikan milestone ini</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="messages" className="mt-4">
              <div className="flex h-[300px] flex-col gap-3 overflow-y-auto rounded-lg border p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "employer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "employer"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      <div className="mt-1 text-xs opacity-70">
                        {format(new Date(message.timestamp), "PPp", {
                          locale: id,
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Textarea
                  placeholder="Ketik pesan Anda di sini..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  className="self-end"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  Kirim
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
