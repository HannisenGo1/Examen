import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../storage/storage';
import { saveReportData } from './data/reportedData';

export const ReportUser = () => {
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [option, setOption] = useState<string>('');
  const { chatRoomId } = useParams();
  const { user } = useUserStore();  

  if (!user || !chatRoomId) {
    return <p>Laddar...</p>; 
  }

  
  const handleReport = async () => {
    if (!option) {
      setReportStatus('Vänligen välj en rapporttyp!');
      return;
    }
    try {
      await saveReportData(chatRoomId!, user.id, option);
      setReportStatus('Rapporten skickades!');
    } catch (error) {
      console.error('Fel vid rapportering:', error);
      setReportStatus('Kunde inte skicka rapporten. Försök igen.');
    }
  };
  



  return (
    <>
      <p>Du rapporterar användare som du chattar med !</p>
      
      {/* Rapport typ */}
      <select onChange={(e) => setOption(e.target.value)} value={option}>
        <option value="">Välj en anledning för rapporten</option>
        <option value="spam">Spam</option>
        <option value="offensive">Oacceptabelt beteende</option>
        <option value="abusive">Hot eller trakasserier</option>
        <option value="sex">Sexuella trakasserier</option>
        <option value="other">Annat</option>
      </select>

      <button className="reportbtn" onClick={handleReport}>Skicka rapport</button>

      {/* Status meddelande */}
      {reportStatus && <p>{reportStatus}</p>}
    </>
  );
};
