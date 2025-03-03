import { quizData } from './quizdata';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../data/firebase';
import { useParams } from 'react-router-dom';
import { User } from '../../interface/interfaceUser';

export interface Quiz {
  userId: string;
  quizId: string;
  setQuizId: (id: string) => void;
  onFinish:() => void 
  startedByVipPlus: boolean;
}

interface UserAnswers {
  [key: string]: string;
}

export const QuizComponent = ({ userId, quizId,startedByVipPlus, setQuizId, onFinish }: Quiz) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestions, setCurrentQuestions] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStartedByVipPlus, setQuizStartedByVipPlus] = useState(false);
  const [messageForUser2, setMessageForUser2] = useState('');
  const { chatRoomId } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [canUser2Joina, setCanUser2Joina]= useState(false)
  const [user, setUser] = useState<User | null>(null);
useEffect(() => {
  const fetchQuizData = async () => {
    if (!quizId) return;

    try {
      const quizRef = doc(db, 'quiz', quizId);
      const quizSnap = await getDoc(quizRef);

      if (quizSnap.exists()) {
        const quizData = quizSnap.data();
        console.log('Quizdata:', quizData);
        setQuestions(quizData?.questions || []); 

        if (quizData.user1 && quizData.user2){
          setCanUser2Joina(true)
        }
      } else {
        console.log('Quizet hittades inte.');
      }
    } catch (error) {
      console.error('Fel vid hämtning av quiz:', error);
    }
  };

  fetchQuizData();
}, [quizId]); 



useEffect(() => {
  if(!startedByVipPlus){
    console.error('Du kan bara delta om Vipplus har startat quizet.')
  }
},[startedByVipPlus])

  // Skapa quiz (VIP PLUS users only)
  const createQuiz = async () => {

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'quiz'), {
        user1: userId,
        user1Answers: {},
        user2: null,
        user2Answers: {},
        createdAt: new Date(),
        startedByVipPlus: true,
        chatRoomId,
      });

      setQuizId(docRef.id);
      console.log('Quiz created with ID:', docRef.id);
    } catch (error) {
      console.error('Error creating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  // Hämta quiz-data
  const fetchQuizData = async (quizId: string) => {
    setIsLoading(true);
    try {
      const quizRef = doc(db, 'quiz', quizId);
      const quizSnap = await getDoc(quizRef);

      if (quizSnap.exists()) {
        const data = quizSnap.data();
        setQuizStartedByVipPlus(data.startedByVipPlus || false);
        setUserAnswers(data.user1 === userId ? data.user1Answers : data.user2Answers);
        setMessageForUser2(data.messageForUser2 ?? '');
      } else {
        console.log('No such quiz!');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Spara svar till firebase
  const saveAnswer = async (question: string, answer: string) => {

    const quizRef = doc(db, 'quiz', quizId);
    const quizSnap = await getDoc(quizRef);

    if (!quizSnap.exists()) {
      console.log('Quizet finns inte');
      return;
    }

    const field = userId === quizSnap.data().user1 ? 'user1Answers' : 'user2Answers';
    const updatedAnswers = { ...userAnswers, [question]: answer };

    await updateDoc(quizRef, { [field]: updatedAnswers });
    setUserAnswers(updatedAnswers);
  };



  // Fetcha quiz-data vid komponent-laddning
  useEffect(() => {
    if (quizId) {
      fetchQuizData(quizId);
    } else {
      createQuiz();
    }
  }, [quizId]);

  // Gå vidare till nästa fråga
  const handleNextQuestion = async () => {
    if (currentQuestions < quizData.Livet.length - 1) {
      setCurrentQuestions((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      onFinish();
    }
  };

  // När quizet är klart, skicka inbjudan
  const handleQuizFinish = async () => {
    setQuizFinished(true);
  
    const quizRef = doc(db, 'quiz', quizId);
    await updateDoc(quizRef, {
      quizFinished: true,
    });
  
    onFinish();
  };

  const handleJoinQuiz = async () => {
    if (!quizId || !user) return;
  
    try {
      const quizRef = doc(db, 'quiz', quizId);
      await updateDoc(quizRef, {
        user2: user.id,
      });
  
      setCanUser2Joina(false); 
      console.log('Du har gått med i quizet!');
    } catch (error) {
      console.error('Fel vid anslutning till quiz:', error);
    }
  };
  
  //return (
  //  <div>
  //    <h1>Quiz</h1>
      
  //    {canUser2Joina && (
  //      <button onClick={handleJoinQuiz}>
  //        Svara på quizet!
  //      </button>
  //    )}
  //  </div> );
  

  // Jämför svar från både användare
  const compareAnswers = (user1Answers: UserAnswers, user2Answers: UserAnswers) => {
    let matchCount = 0;
    Object.keys(user1Answers).forEach((question) => {
      if (user1Answers[question] === user2Answers[question]) {
        matchCount++;
      }
    });
    const totalQuestions = Object.keys(user1Answers).length;
    return (matchCount / totalQuestions) * 100;
  };

  if (isLoading) return <p>Laddar Quiz...</p>;

  if (quizFinished) {
    return (
      <div>
        <p>Quizet är klart! Vänta på den andra användaren.</p>
        {messageForUser2 && <p>{messageForUser2}</p>}
        <button onClick={() => console.log('Matchningsresultat: ' + compareAnswers(userAnswers, {}))}>
          Visa matchning
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
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
      <button onClick={handleNextQuestion} disabled={isLoading || quizFinished}>
        Nästa fråga
      </button>
      {quizFinished && (
        <button onClick={handleQuizFinish}>
          Skicka till den andra användaren
        </button>
      )}
    </div>
  );
};
