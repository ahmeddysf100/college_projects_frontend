export interface jwt {
  accessToken: string;
  userId: number;
}


export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface login {
  email: string;
  password: string;
}

export interface Signup {
  namee: string;
  email: string;
  password: string;
}

export interface AnswerExplanationItem {
  id: number;
  explanationText: string | null;
  A_imageUrl: string;
}

export interface answersItem {
  A_text: string;
  isCorrect: boolean;
}

export interface OriginalItem {
  id: number;
  Q_imageUrl: string;
  Q_text: string | null;
  correctAnswer: string;
  answers: any[]; // Adjust the type based on your actual structure
  AnswerExplanation: AnswerExplanationItem[];
}

export interface FilteredItem {
  id: number;
  Q_imageUrl: string;
  Q_text: string;
  correctAnswer: string;
  answers: answersItem[]; // Adjust the type based on your actual structure
  AnswerExplanation: AnswerExplanationItem[];
}


export interface Question {
  id:              number;
  Q_imageUrl?:      string;
  Q_text?:          string;
  correctAnswer?:   string;
  answers?:         answer[];
  explanationText?: string;
  A_imageUrl?:      string;
}

export interface answer {
A_text: string;
isCorrect: string;
}

export interface ArenaGear {
  id:                number;
  Q_imageUrl:        null | string;
  Q_text:            null | string;
  correctAnswer:     null | string;
  subjectId:         number;
  createdAt:         Date;
  updatedAt:         Date;
  quizId:            number;
  answers:           Answer[];
  AnswerExplanation: AnswerExplanation[];
}

export interface AnswerExplanation {
  id:              number;
  explanationText: null | string;
  A_imageUrl:      null | string;
  questionId:      number;
  createdAt:       Date;
  updatedAt:       Date;
}

export interface Answer {
  id:         number;
  A_text:     string;
  isCorrect:  boolean;
  questionId: number;
  createdAt:  Date;
  updatedAt:  Date;
}
