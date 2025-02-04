
export interface inlogUser {
email: string;
password: string;
}


export type FormData = {
    firstName: string;
    age: string;
    city: string;
    gender: string;
    sexualOrientation: string;
    religion: string;
    interests: string[];
    hasChildren: boolean;
    wantsChildren: boolean;
    smokes: string;
    relationshipStatus: string;
    education: string;
    photo: File | null;
    favoriteSong: string | '';
    favoriteMovie: string |'';
    email: string;
    lifeStatement1: string;
    lifeStatement2:string;
    id?:string;
    password: string;
};
export interface User {
    firstName: string;
    lastName: string;
    age: string;
    city: string;
    gender: string;
    sexualOrientation: string;
  }