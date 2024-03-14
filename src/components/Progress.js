import React from "react";
import { useQuiz } from "../contexts/QuizContext";

export default function Progress() {
  const { index, answer, numQuestions, sumPoints, points } = useQuiz();
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        <strong>{points}</strong>/{sumPoints} Points
      </p>
    </header>
  );
}
