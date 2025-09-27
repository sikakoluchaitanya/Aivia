import React from "react";
import { getAuthSession } from "../../lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "../../components/Quizcreation";

export const metadata = {
  title: "Quiz | Aivai",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: Promise<{
    topic?: string;
  }>;
}

const Quiz = async ({ searchParams }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }

  const params = await searchParams; // ✅ await it here

  return <QuizCreation topic={params.topic ?? ""} />;
};

export default Quiz;
