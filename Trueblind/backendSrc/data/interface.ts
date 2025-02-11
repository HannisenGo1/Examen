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