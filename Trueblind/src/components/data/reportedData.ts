import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveReportData = async (chatRoomId: string, senderId: string, option: string) => {
  if (!chatRoomId || !senderId || !option) {
    return;
  }

  try {
    const reportRef = doc(db, "reports", chatRoomId + "_" + senderId); 
    await setDoc(reportRef, {
      chatRoomId,
      senderId,
      option,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(error);
  }
};
