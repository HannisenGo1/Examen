import { collection, getDocs, doc, updateDoc, getDoc  } from 'firebase/firestore';
import { db } from './firebase'; 
import { useUserStore } from '../../storage/storage';
import { User } from '../../interface/interfaceUser';

export const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: User[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];

    useUserStore.getState().setUsers(users); 
  } catch (error) {
    console.error(error);
  }
};

export const updateOnlineStatus = async (user: User, online: boolean): Promise<void> => {
  const updatedUser = {
    ...user,
    status: {
      online,
      lastLogin: online ? Date.now() : user.status?.lastLogin ?? null,     },
  };

  useUserStore.getState().setUser(updatedUser);

  try {
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, {
      status: updatedUser.status, 
    });
  } catch (error) {
    console.error(error);
  }
};
export const fetchUserName = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      return userDoc.data()?.firstName || "Okänd användare"
    }
  } catch (error) {
    console.error(error)
    return "Okänd användare";
  }
};