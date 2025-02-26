import { quizData } from './quizdata';
import { useState, useEffect  } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../data/firebase';

// koppla detta med firebase för att kunna jämföra svaren 
// mindre risk för manipulering av svaren ( mer säkerhet)
// lägga till ett id till quizen för att göra det lättare att jämföra

export interface Quiz {
  userId: string;
  quizId: string;
  setQuizId: (id: string) => void;
  vipPlusStatus: boolean
}

interface UserAnswers {
  [key: string]: string;
}


export const QuizComponent = ({userId, quizId, setQuizId, vipPlusStatus} : Quiz ) => {
  console.log('collection db::', db)
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestions, setCurrentQuestions] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStartedByVipPlus, setQuizStartedByVipPlus] = useState(false)

// Skapandet av en Quiz när man påbörjar spelet :D 
  const createQuiz = async () => {
    if (!vipPlusStatus){
      console.error('Endast VIP PLUS kan starta  quizet.')
      return
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'quiz'), {
        user1: userId,
        user1Answers: {},
        user2: null,
        user2Answers: {},
        createdAt: new Date(),
        startedByVipPlus: true,
      });

      setQuizId(docRef.id);
      console.log('Quiz created with ID:', docRef.id);
    } catch (error) {
      console.error('Error creating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hämtar quiz-data
  const fetchQuizData = async (quizId: string) => {
    setIsLoading(true);
    try {
      const quizRef = doc(db, 'quiz', quizId);
      const quizSnap = await getDoc(quizRef);

      if (quizSnap.exists()) {
        const data = quizSnap.data();
        console.log('Fetched quiz:', data);
        setQuizStartedByVipPlus(data.startedByVipPlus ?? false)
        setUserAnswers(data.user1 === userId ? data.user1Answers : data.user2Answers);
      } else {
        console.log('No such quiz!');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // svaren sparas till firebase
  const saveAnswer = async (question: string, answer: string) => {
    if (!quizStartedByVipPlus){
      console.error('Du kan endast delta om den startades av en VIP PLUS')
    return
    }

    const quizRef = doc(db, 'quiz', quizId);
    const quizSnap = await getDoc(quizRef);
    
    if (!quizSnap.exists()) {
      console.log("Quizet finns inte");
      return;
    }
  
    const field = userId === quizSnap.data().user1 ? 'user1Answers' : 'user2Answers';
    const updatedAnswers = { ...userAnswers, [question]: answer };

    await updateDoc(quizRef, { [field]: updatedAnswers });
    setUserAnswers(updatedAnswers);
  };

// fetcha ut beroende på Quiz Id:et
  useEffect(() => {
    if (quizId) {
      fetchQuizData(quizId);
    } else {
      createQuiz();
    }
  }, [quizId]);


 // för att få nästa fråga 
  const handleNextQuestion = () => {
    if (currentQuestions < quizData.Livet.length - 1) {
      setCurrentQuestions((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (isLoading) return <p>Laddar Quiz...</p>;
  if (quizFinished) {
    return <p>Quizet är klart! Vänta på den andra användaren.</p>;
  }

  return (
    <div>
      <h2>{quizData.Livet[currentQuestions].question}</h2>
      {quizData.Livet[currentQuestions].options.map((option, index) => (
        <label key={index}>
          <input
            type="radio"
            value={option}
            checked={userAnswers[quizData.Livet[currentQuestions].question] === option}
            onChange={() => saveAnswer(quizData.Livet[currentQuestions].question, option)}
          />
          {option}
        </label>
      ))}
      <button onClick={handleNextQuestion}>Nästa fråga</button>
    </div>
  );
};