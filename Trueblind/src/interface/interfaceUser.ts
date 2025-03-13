
export type FormData = {
  minAge?: number; 
  maxAge?: number;
  firstName: string;
  lastName: string;
  age: {  
    month: string;  
    day: string;   
    year: string;   
  };
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
  favoriteSong: string;
  favoriteMovie: string;
  email: string;
  lifeStatement1: string;
  lifeStatement2: string;
  id?: string;
  credits: number;
  password?:string;
  purchasedEmojis: Emoji[];
  vipStatus: boolean;
  vipExpiry: number | null; 
  vipPlusStatus: boolean;
  vipPlusExpiry: number | null; 
  hasUsedPromoCode: boolean;
  VipplusEmoji?: VipEmoji[]

};
type Emoji = { emoji:string; count:number}

type VipEmoji = { emoji:string; count:number }

export interface User {
  firstName: string;
  lastName?:string;

 age: {  
    month: string;  
    day: string;   
    year: string;   
  };

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
  hasUsedPromoCode?:boolean;
  vipStatus: boolean;
  vipExpiry?: number | null; 
  vipPlusStatus:boolean;
  vipPlusExpiry?: number | null;
  denylist?: User[];
  VipplusEmoji?: VipEmoji[]

  status?: {
    online:boolean
    lastLogin: string | number | null;
  }
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

export interface Chat {
  chatRoomId: string;
  userIds: string[];
  messages: Message[];
  userNames: string[];

  startedByVipPlus?:boolean
  
  status?: {
    online:boolean
    lastLogin: string | number | null;
  }
}
