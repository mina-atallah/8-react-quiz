import React from "react";
import { useQuiz } from "../contexts/QuizContext";

export default function FinishScreen() {
  const { points, sumPoints, highscore, dispatch } = useQuiz();

  // derived state from points and sumPoints
  const percentage = (points / sumPoints) * 100;

  return (
    <>
      <p className="result">
        You Scored <strong>{points}</strong> out of {sumPoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(HighScore: {highscore} Points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}
