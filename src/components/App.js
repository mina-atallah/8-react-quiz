import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],
  /* 
    status is instead of isLoading state 
    status of the application 
    ('loading','error','ready', 'active', 'finished')
  */
  status: "loading",
  /*
  - an index to track the current question to display 
  - we need this index as variable because it will re-render and update the state so the next question is displayed
  */
  index: 0,
  /* 
    new piece of state to know which option was selected & to know the correct answer 
    = answer is the index number of the option
  */
  answer: null,
  /*
    new piece of state to be updated after q qestion is answered
  */
  points: 0,
  highscore: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      /* 
        - a variable to know which is the current question 
        - because we don't have that stored in the state
        - we only know the index, not the question itself
        - doing that by laveraging the CURRENT STATE in the reducer 
        - check the current question to the receieved answer to update the points
      */
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    default:
      throw new Error("Action is unkown");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, initialState);

  // deprived state
  const numQuestions = questions.length;
  // deprived state to sum of all points
  const sumPoints = questions.reduce(
    (acc, currQuestion) => acc + currQuestion.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              sumPoints={sumPoints}
              numQuestions={numQuestions}
              points={points}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            sumPoints={sumPoints}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
