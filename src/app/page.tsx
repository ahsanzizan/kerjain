import { Text } from "@/components/common/text";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();
  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Text variant="body">Aku Sigma</Text>
    </main>
  );
}
