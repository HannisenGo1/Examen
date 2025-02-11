import { useState } from "react";
import { storage, db, auth } from "../data/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export const AccountPage: React.FC = () => {
  const [profileURL, setProfileURL] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      console.error("Ingen användare inloggad.");
      return;
    }

    try {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await setDoc(doc(db, "users", user.uid), { profileImage: downloadURL }, { merge: true });

      setProfileURL(downloadURL);
    } catch (error) {
      console.error("Fel vid uppladdning av bild:", error);
    }
  };

  return (
    <div>
      <h2>Ditt konto</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {profileURL && <img src={profileURL} alt="Profilbild" style={{ width: "100px", borderRadius: "50%" }} />}
    </div>
  );
};
