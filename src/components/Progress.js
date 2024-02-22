import React from "react";

export default function Progress({
  index,
  numQuestions,
  points,
  questions,
  answer,
}) {
  // deprived state to sum of all points
  const sumPoints = questions.reduce(
    (acc, currQuestion) => acc + currQuestion.points,
    0
  );

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
