
export interface inlogUser {
email: string;
password: string;
}


export type FormData = {
    minAge?: 0,
    maxAge?: 100,
    firstName: string;
    lastName:string;
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
    photo?: File | null;
    favoriteSong: string | '';
    favoriteMovie: string |'';
    email: string;
    lifeStatement1: string;
    lifeStatement2:string;
    id?:string;

    password: string;
    ommig?:string;
};
type Emoji = { emoji:string; count:number}

export interface User {
    firstName: string;
    lastName?:string;
    age: number;
    city: string;
    email: string;
    gender: string;
    sexualOrientation: string;
    religion: string;
    lifeStatement1?: string;
    lifeStatement2?:string;
    id:string;
    interests: string[];
    hasChildren: boolean;
    wantsChildren: boolean;
    smokes: string;
    relationshipStatus: string;
    favoriteSong: string; 
    favoriteMovie: string;
    education: string;
    photo?:string;
    credits: number;
    purchasedEmojis: Emoji[];
    purchaseEmoji: (emoji: string, cost: number) => void;
    updateUser: (updatedFields: Partial<User>) => void;
    addCredits: (amount: number) => void;
    ommig?:string;
    vipStatus: boolean;
    vipExpiry?: number | null; 
    hasUsedPromoCode?:boolean;
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
