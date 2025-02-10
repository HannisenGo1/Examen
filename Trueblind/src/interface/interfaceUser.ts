
export interface inlogUser {
email: string;
password: string;
}


export type FormData = {
    minAge?: 0,
    maxAge?: 100,
    firstName: string;
    age: number;
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
    age: number;
    city: string;
    gender: string;
    sexualOrientation: string;
    religion: string;
    lifeStatement1?: string;
    lifeStatement2?:string;
    id?:string;
    interests: string[];
    hasChildren: boolean;
    wantsChildren: boolean;
    smokes: string;
    relationshipStatus: string;
    education: string;
    photo?:string;
  }
  export interface SearchResult {
      age: number;
      gender: string;
      distance: string;
      religion:string;
      
    }
    export interface Message  {
      id: string;
      senderId: string;
      senderName: string;
      timestamp: string;
      message:string;
    };