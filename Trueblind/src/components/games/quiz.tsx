import { quizData } from './quizdata';
import { useState } from 'react';

export const QuizComponent = () => {

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: { user1: string; user2: string } }>({});
  const [currentQuestions, setCurrentQuestions] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [user1Answered, setUser1Answered] = useState(false);
  const [user2Answered, setUser2Answered] = useState(false);


  const handleUser1Answer = (question: string, answer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: { ...prevAnswers[question], user1: answer },
    }));
    setUser1Answered(true); 
  };


  const handleUser2Answer = (question: string, answer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: { ...prevAnswers[question], user2: answer },
    }));
    setUser2Answered(true); 
  };

  const handleNextQuestion = () => {
    if (currentQuestions < quizData.Livet.length - 1) {
      setCurrentQuestions(currentQuestions + 1);
      setUser1Answered(false); 
      setUser2Answered(false); 
    } else {
   
      setQuizFinished(true);
    }
  };


  const calculateMatchPercentage = () => {
    const totalQuestions = quizData.Livet.length;
    const matchingAnswers = Object.values(userAnswers).filter(
      (answer) => answer.user1 === answer.user2
    ).length;
    return Math.round((matchingAnswers / totalQuestions) * 100);
  };


  if (quizFinished) {
    const matchPercentage = calculateMatchPercentage();
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Din matchningsprocent är: {matchPercentage}%</p>
      </div>
    );
  }


  const currentQuestion = quizData.Livet[currentQuestions];

  return (
    <div className="columndiv2">
      <div className="question">
        <p>{currentQuestion.question}</p>

        {!user1Answered && (
          <>
            {currentQuestion.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`${currentQuestion.question}-user1-${option}`}
                  name={`user1-${currentQuestion.question}`}
                  value={option}
                  onChange={() => handleUser1Answer(currentQuestion.question, option)}
                  checked={userAnswers[currentQuestion.question]?.user1 === option}
                />
                <label htmlFor={`${currentQuestion.question}-user1-${option}`}>{option}</label>
              </div>
            ))}
          </>
        )}


        {user1Answered && !user2Answered && !quizFinished && (
          <>
            {currentQuestion.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`${currentQuestion.question}-user2-${option}`}
                  name={`user2-${currentQuestion.question}`}
                  value={option}
                  onChange={() => handleUser2Answer(currentQuestion.question, option)}
                  checked={userAnswers[currentQuestion.question]?.user2 === option}
                />
                <label htmlFor={`${currentQuestion.question}-user2-${option}`}>{option}</label>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="navigation">
        <button onClick={handleNextQuestion} disabled={!user1Answered || !user2Answered}>
          {currentQuestions < quizData.Livet.length - 1 ? 'Nästa fråga' : 'Avsluta quiz'}
        </button>
      </div>
    </div>
  );
};