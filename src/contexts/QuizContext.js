import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

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
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
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
    case "restart":
      return { ...initialState, status: "ready", questions: state.questions };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action is unkown");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  // derived state
  const numQuestions = questions.length;
  // derived state to sum of all points
  const sumPoints = questions.reduce(
    (acc, currQuestion) => acc + currQuestion.points,
    0
  );

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        sumPoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside Provider");
  return context;
}

export { QuizProvider, useQuiz };
