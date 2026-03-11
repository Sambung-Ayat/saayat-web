import { useState } from "react";
import { Question, QuestionOption } from "../types/quran";

interface ValidateResponseData {
  isCorrect: boolean;
  comboStreak: number;
  pointsGained: number;
  totalPoints: number;
  remainingQuestions: number;
  currentCorrectStreak?: number;
  correctAyah?: { text: string; surah: number; ayah: number };
}

export function useVerseValidation(
  sessionLimit: number,
  playSound: (type: "correct" | "wrong" | "completed") => void,
) {
  const [isValidating, setIsValidating] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [correctAyah, setCorrectAyah] = useState<QuestionOption | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [pointsGained, setPointsGained] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [remainingQuestions, setRemainingQuestions] =
    useState<number>(sessionLimit);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateAnswer = async (option: QuestionOption, question: Question) => {
    if (!option || !question) return;

    setIsValidating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quiz/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            choiceKey: option.key,
            challengeToken: question.challengeToken,
            sessionLimit,
          }),
        },
      );

      if (!res.ok) throw new Error("Validation failed");

      const { data }: { data: ValidateResponseData } = await res.json();

      console.log("Validation response:", data);

      setFeedback(data.isCorrect ? "correct" : "incorrect");

      if (data.isCorrect) {
        setCorrectCount((prev) => prev + 1);
        setCombo(data.comboStreak ?? 0);
        setPointsGained(data.pointsGained ?? 0);
        setMaxCombo((prev) => Math.max(prev, data.comboStreak ?? 0));
        setMaxStreak((prev) => Math.max(prev, data.currentCorrectStreak ?? 0));
        playSound("correct");
      } else {
        setStreak(0);
        setCombo(0);
        setPointsGained(0);
        playSound("wrong");
      }

      setTotalPoints(data.totalPoints ?? 0);
      setRemainingQuestions(data.remainingQuestions ?? 0);

      if (data.correctAyah) {
        setCorrectAyah({
          key: "correct",
          text: data.correctAyah.text,
          surah: data.correctAyah.surah,
          ayah: data.correctAyah.ayah,
        } as any);
      }

      setIsSubmitted(true);
      return data;
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const resetValidationState = () => {
    setFeedback(null);
    setCorrectAyah(null);
    setIsSubmitted(false);
  };

  const resetSessionStats = (limit: number) => {
    setCombo(0);
    setMaxCombo(0);
    setStreak(0);
    setMaxStreak(0);
    setPointsGained(0);
    setTotalPoints(0);
    setCorrectCount(0);
    setRemainingQuestions(limit);
    resetValidationState();
  };

  return {
    isValidating,
    feedback,
    correctAyah,
    streak,
    combo,
    maxCombo,
    maxStreak,
    pointsGained,
    totalPoints,
    remainingQuestions,
    correctCount,
    isSubmitted,
    validateAnswer,
    resetValidationState,
    resetSessionStats,
  };
}
