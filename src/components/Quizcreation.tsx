"use client";
import { quizCreationSchema } from "../schemas/form/quiz";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { BookOpen, CopyCheck, Brain, Zap, Target, ChevronRight } from "lucide-react";
import { Separator } from "../components/ui/separator";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import LoadingQuestions from "../components/LoadingQuestions";

type Props = {
  topic: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const { toast } = useToast();
  const { mutate: getQuestions, status } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post("/api/game", { amount, topic, type });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: "mcq",
      amount: 3,
    },
  });

  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
          }
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            router.push(`/play/mcq/${gameId}`);
          } else if (form.getValues("type") === "open_ended") {
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  };
  
  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Create Your Quiz
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test your knowledge on any topic you choose
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Topic Field */}
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-blue-500" />
                        Quiz Topic
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g., JavaScript, World History, Biology..." 
                            {...field}
                            className="h-12 text-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                        Enter any topic you'd like to test your knowledge on
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Number of Questions */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <span className="w-5 h-5 mr-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded text-white text-xs flex items-center justify-center font-bold">#</span>
                        Number of Questions
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="How many questions?"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              form.setValue("amount", parseInt(e.target.value));
                            }}
                            min={1}
                            max={5}
                            className="h-12 text-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-600 dark:text-gray-400">
                        Choose between 1-5 questions for your quiz
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quiz Type Selection */}
                <div>
                  <FormLabel className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 block">
                    Quiz Type
                  </FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Multiple Choice Option */}
                    <button
                      type="button"
                      onClick={() => form.setValue("type", "mcq")}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                        form.getValues("type") === "mcq"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-400"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          form.getValues("type") === "mcq"
                            ? "bg-blue-500"
                            : "bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-400"
                        } transition-colors duration-300`}>
                          <CopyCheck className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Multiple Choice
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Choose from multiple answer options for each question
                          </p>
                        </div>
                      </div>
                      {form.getValues("type") === "mcq" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </button>

                    {/* Open Ended Option */}
                    <button
                      type="button"
                      onClick={() => form.setValue("type", "open_ended")}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                        form.getValues("type") === "open_ended"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-purple-300 dark:hover:border-purple-400"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          form.getValues("type") === "open_ended"
                            ? "bg-purple-500"
                            : "bg-gray-300 dark:bg-gray-600 group-hover:bg-purple-400"
                        } transition-colors duration-300`}>
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Open Ended
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Write your own answers to test deeper knowledge
                          </p>
                        </div>
                      </div>
                      {form.getValues("type") === "open_ended" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  disabled={status === "pending"} 
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {status === "pending" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      Start Quiz
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1-5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quiz Types</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Topics</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreation;