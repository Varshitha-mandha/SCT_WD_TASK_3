import { createFileRoute } from "@tanstack/react-router";
import { QuizApp } from "@/components/quiz/QuizApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeQuiz Pro — Test Your Programming Knowledge" },
      { name: "description", content: "An interactive 5-question coding quiz. Test your knowledge of HTML, CSS, Python, data structures, and AI." },
      { property: "og:title", content: "CodeQuiz Pro" },
      { property: "og:description", content: "Test Your Programming Knowledge with CodeQuiz Pro." },
    ],
  }),
  component: QuizApp,
});
