"use client";

import { Button } from "@/components/ui/button";
import { requestVerificationMail } from "@/server/actions/email";
import { type FC, useState } from "react";
import { toast } from "sonner";

export const ResendVerificationMailButton: FC<{ email: string }> = ({
  email,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant={"link"}
      disabled={loading}
      className="w-full"
      onClick={async () => {
        setLoading(true);

        const loadingToast = toast.loading("Loading...");

        const resendResult = await requestVerificationMail(email);

        if (!resendResult.success) {
          toast.error(resendResult.message, { id: loadingToast });
          return setLoading(false);
        }

        toast.success("Berhasil mengirim ulang email verifikasi!", {
          id: loadingToast,
        });
        return setLoading(false);
      }}
    >
      Belum menerima email? Kirim ulang
    </Button>
  );
};
