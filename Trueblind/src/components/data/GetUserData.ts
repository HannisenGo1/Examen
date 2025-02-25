import { collection, getDocs } from 'firebase/firestore';
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

    console.log('Hämtade användare från Firestore:', users);
  } catch (error) {
    console.error('Kunde inte hämta användare:', error);
  }
};
