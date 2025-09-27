"use client";

import SignInButton from "../components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Card className="w-[350px] rounded-2xl border border-border/40 bg-white/70 p-4 shadow-lg backdrop-blur-md transition hover:shadow-xl dark:bg-gray-900/70">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome to <span className="text-blue-600">Aivia</span> 🚀
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Create AI-powered quizzes in seconds.  
            Get started by signing in below!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-4">
          <SignInButton text="Sign in with Google" />
        </CardContent>
      </Card>
    </div>
  );
}
