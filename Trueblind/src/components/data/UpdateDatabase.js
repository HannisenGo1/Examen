import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
export const updateUserInDatabase = async (updatedUser) => {
    const userRef = doc(db, 'users', updatedUser.id);
    const userDataToUpdate = {
        credits: updatedUser.credits ?? 0,
        vipStatus: updatedUser.vipStatus ?? false,
        vipExpiry: updatedUser.vipExpiry ?? null,
        vipPlusStatus: updatedUser.vipPlusStatus ?? false,
        vipPlusExpiry: updatedUser.vipPlusExpiry ?? null,
        purchasedEmojis: updatedUser.purchasedEmojis ?? [],
        city: updatedUser.city ?? null,
        sexualOrientation: updatedUser.sexualOrientation ?? null,
        hasUsedPromoCode: updatedUser.hasUsedPromoCode ?? false,
    };
    try {
        await updateDoc(userRef, userDataToUpdate);
    }
    catch (error) {
        console.error(error);
    }
};
export const updateEmojiCountInDatabase = async (userId, emojiName, count) => {
    const userRef = doc(db, 'users', userId);
    const userDataToUpdate = {
        [`purchasedEmojis.${emojiName}.count`]: count,
    };
    try {
        await updateDoc(userRef, userDataToUpdate);
    }
    catch (error) {
        console.error(error);
    }
};
export const getUserFromDatabase = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
        return userSnapshot.data();
    }
    else {
        console.log("No user found with the given ID.");
        return null;
    }
};
