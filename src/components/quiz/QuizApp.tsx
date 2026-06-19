import { useMemo, useState } from "react";
import { Check, X, ChevronLeft, ChevronRight, RotateCcw, Play, Trophy, Code2, Sparkles } from "lucide-react";
import { questions, POINTS_PER_QUESTION, type Question } from "@/lib/quiz-data";
import { cn } from "@/lib/utils";

type Screen = "welcome" | "quiz" | "results";

export function QuizApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));

  const score = useMemo(
    () => answers.reduce<number>((s, a, i) => (a === questions[i]!.correctIndex ? s + POINTS_PER_QUESTION : s), 0),
    [answers],
  );
  const correctCount = answers.filter((a, i) => a === questions[i]!.correctIndex).length;
  const wrongCount = answers.filter((a) => a !== null).length - correctCount;

  const start = () => {
    setAnswers(questions.map(() => null));
    setCurrent(0);
    setScreen("quiz");
  };

  const selectAnswer = (optionIndex: number) => {
    if (answers[current] !== null) return;
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
  };

  const goNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
    else setScreen("results");
  };
  const goPrev = () => current > 0 && setCurrent(current - 1);
  const restart = () => {
    setAnswers(questions.map(() => null));
    setCurrent(0);
    setScreen("welcome");
  };

  return (
    <main className="min-h-screen w-full px-4 py-8 sm:py-14 flex items-start sm:items-center justify-center">
      <div className="w-full max-w-3xl">
        {screen === "welcome" && <Welcome onStart={start} />}
        {screen === "quiz" && (
          <QuizView
            question={questions[current]!}
            index={current}
            total={questions.length}
            selected={answers[current]!}
            score={score}
            onSelect={selectAnswer}
            onNext={goNext}
            onPrev={goPrev}
            onRestart={restart}
          />
        )}
        {screen === "results" && (
          <Results
            score={score}
            correct={correctCount}
            wrong={wrongCount}
            answers={answers}
            onRestart={restart}
          />
        )}
      </div>
    </main>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="glass rounded-3xl p-8 sm:p-14 text-center animate-fade-up">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono mb-6">
        <Sparkles className="size-3.5" /> v1.0 · 5 questions
      </div>
      <div className="mx-auto mb-6 size-20 rounded-2xl glass grid place-items-center glow-primary">
        <Code2 className="size-10 text-primary" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-br from-[#374151] via-[#374151] to-[#C4B5FD] bg-clip-text text-transparent">
        CodeQuiz Pro
      </h1>
      <p className="mt-3 text-base sm:text-lg text-muted-foreground">
        Test Your Programming Knowledge
      </p>
      <p className="mt-2 text-sm text-muted-foreground/80 font-mono">
        5 questions · 20 pts each · 100 total
      </p>
      <button
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C4B5FD] to-[#F9A8D4] text-[#4B5563] font-semibold glow-primary hover:scale-[1.03] active:scale-[0.98] transition-transform"
      >
        <Play className="size-5" /> Start Quiz
      </button>
    </div>
  );
}

function QuizView({
  question,
  index,
  total,
  selected,
  score,
  onSelect,
  onNext,
  onPrev,
  onRestart,
}: {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  score: number;
  onSelect: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
}) {
  const isAnswered = selected !== null;
  const isCorrect = selected === question.correctIndex;
  const progress = ((index + (isAnswered ? 1 : 0)) / total) * 100;

  return (
    <div className="glass rounded-3xl p-6 sm:p-10 animate-fade-up">
      {/* Top bar */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 mb-5">
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Question {index + 1} of {total}
          </p>
          <h2 className="mt-1 text-lg sm:text-xl font-semibold truncate">CodeQuiz Pro</h2>
        </div>
        <div className="shrink-0 px-4 py-2 rounded-xl bg-primary/15 border border-primary/30 font-mono">
          <span className="text-xs text-muted-foreground">Score</span>{" "}
          <span className="text-primary font-bold">{score}</span>
          <span className="text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 w-full rounded-full bg-[#EDE9FE] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#93C5FD] via-[#C4B5FD] to-[#F9A8D4] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <h3 key={question.id} className="mt-8 text-xl sm:text-2xl font-semibold leading-snug animate-fade-up">
        {question.question}
      </h3>

      {/* Options */}
      <div className="mt-6 grid gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOption = i === question.correctIndex;
          const showCorrect = isAnswered && isCorrectOption;
          const showWrong = isAnswered && isSelected && !isCorrectOption;

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={isAnswered}
              className={cn(
                "group relative w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300",
                "bg-[#F3F0F7] border-[#E5E7EB] hover:bg-[#EDE9FE] hover:border-[#C4B5FD]",
                "disabled:cursor-not-allowed",
                showCorrect && "bg-[#BBF7D0] border-[#86EFAC] text-[#166534] animate-pop-in",
                showWrong && "bg-[#FECACA] border-[#FCA5A5] text-[#991B1B] animate-shake",
              )}
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg font-mono text-sm shrink-0",
                    "bg-white border border-[#E5E7EB] text-muted-foreground",
                    showCorrect && "bg-[#86EFAC] text-[#166534] border-[#86EFAC]",
                    showWrong && "bg-[#FCA5A5] text-[#991B1B] border-[#FCA5A5]",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0 text-base sm:text-lg">{opt}</span>
                {showCorrect && <Check className="size-5 text-[#166534] shrink-0" />}
                {showWrong && <X className="size-5 text-[#991B1B] shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <div className="mt-5 min-h-[2.5rem]">
        {isAnswered && (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold animate-pop-in",
              isCorrect ? "bg-[#BBF7D0] text-[#166534] border border-[#86EFAC]" : "bg-[#FECACA] text-[#991B1B] border border-[#FCA5A5]",
            )}
          >
            {isCorrect ? "Correct Answer!" : "Wrong Answer!"}
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F3F0F7] border border-[#E5E7EB] hover:bg-[#EDE9FE] transition disabled:opacity-40 disabled:cursor-not-allowed text-[#374151]"
        >
          <ChevronLeft className="size-4" /> Previous
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-muted-foreground hover:text-[#374151] transition text-sm"
        >
          <RotateCcw className="size-4" /> Restart
        </button>
        <button
          onClick={onNext}
          disabled={!isAnswered}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C4B5FD] to-[#F9A8D4] text-[#4B5563] font-semibold glow-primary hover:scale-[1.03] active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {index === total - 1 ? "See Results" : "Next"} <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function getPerformance(pct: number) {
  if (pct === 100) return { emoji: "🏆", text: "Excellent!" };
  if (pct >= 80) return { emoji: "🎉", text: "Great Job!" };
  if (pct >= 60) return { emoji: "👍", text: "Good Effort!" };
  if (pct >= 40) return { emoji: "📚", text: "Keep Learning!" };
  return { emoji: "💻", text: "Practice More!" };
}

function Results({
  score,
  correct,
  wrong,
  answers,
  onRestart,
}: {
  score: number;
  correct: number;
  wrong: number;
  answers: (number | null)[];
  onRestart: () => void;
}) {
  const pct = Math.round((score / (questions.length * POINTS_PER_QUESTION)) * 100);
  const perf = getPerformance(pct);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="glass rounded-3xl p-8 sm:p-12 text-center" style={{ background: "linear-gradient(135deg, #DDD6FE, #FBCFE8)" }}>
        <div className="mx-auto mb-4 size-16 rounded-2xl glass grid place-items-center glow-primary">
          <Trophy className="size-8 text-primary" />
        </div>
        <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Final Score</p>
        <h2 className="mt-2 text-6xl sm:text-7xl font-bold bg-gradient-to-br from-[#374151] to-[#C4B5FD] bg-clip-text text-transparent">
          {score}<span className="text-3xl text-muted-foreground">/100</span>
        </h2>
        <p className="mt-4 text-2xl sm:text-3xl font-semibold text-[#374151]">
          {perf.emoji} {perf.text}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <Stat label="Correct" value={correct} tone="success" />
          <Stat label="Wrong" value={wrong} tone="destructive" />
          <Stat label="Percentage" value={`${pct}%`} tone="primary" />
        </div>

        <button
          onClick={onRestart}
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C4B5FD] to-[#F9A8D4] text-[#4B5563] font-semibold glow-primary hover:scale-[1.03] active:scale-[0.98] transition"
        >
          <RotateCcw className="size-5" /> Restart Quiz
        </button>
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-semibold mb-4 text-[#374151]">Answer Review</h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAns = answers[i] ?? null;
            const ok = userAns === q.correctIndex;
            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-2xl p-5 border",
                  ok
                    ? "bg-[#BBF7D0] border-[#86EFAC]"
                    : "bg-[#FECACA] border-[#FCA5A5]",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "grid size-7 place-items-center rounded-lg shrink-0 text-sm font-mono",
                      ok ? "bg-[#86EFAC] text-[#166534]" : "bg-[#FCA5A5] text-[#991B1B]",
                    )}
                  >
                    {ok ? <Check className="size-4" /> : <X className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#374151]">{i + 1}. {q.question}</p>
                    <div className="mt-2 text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Your answer: </span>
                        <span className={ok ? "text-[#166534]" : "text-[#991B1B]"}>
                          {userAns === null ? "— not answered —" : q.options[userAns]}
                        </span>
                      </p>
                      {!ok && (
                        <p>
                          <span className="text-muted-foreground">Correct answer: </span>
                          <span className="text-[#166534]">{q.options[q.correctIndex]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone: "success" | "destructive" | "primary" }) {
  const toneCls =
    tone === "success" ? "text-[#166534] border-[#86EFAC]/50 bg-[#BBF7D0]/50"
    : tone === "destructive" ? "text-[#991B1B] border-[#FCA5A5]/50 bg-[#FECACA]/50"
    : "text-[#374151] border-[#C4B5FD]/50 bg-[#EDE9FE]/50";
  return (
    <div className={cn("rounded-2xl p-4 border", toneCls)}>
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-wider mt-1 opacity-80">{label}</p>
    </div>
  );
}
