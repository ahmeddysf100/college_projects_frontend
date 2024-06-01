export interface CreateArena {
  arena: Arena;
  accessToken: string;
}
export interface JoinArena {
  arena: Arena;
  accessToken: string;
  userId: string
}

// export interface Ranks {
//   name: string;
//   userId: string;
//   rank: number;
// }

export interface arenaForDto {
  arenaGear: ArenaQear[];
  numOfPlayers: number;
  adminName: string | undefined;
  hasStarted: boolean;
  roundTime: number;
}

export interface joinArenaDto {
  arenaId: string;
  name: string;
}

export interface Arena {
  id: string;
  arenaGear: ArenaQear[];
  numOfPlayers: number;
  adminId: string;
  hasStarted: boolean;
  roundTime: number;
  participants: participant[];
  nominations: Nominations;
  rankings: Rankings[];
  results: any[];
  totalStages: number;
  currentStage: number;
}
export interface Arena_updated {
  arenaData: Arena_updated_data;
  gearData: Arena_updated_gear | string;
  title: string;
}

export interface Arena_updated_gear {
  id:                number;
  Q_imageUrl:        string | null;
  Q_text:            string | null;
  correctAnswer:     string | null | number;
  subjectId:         number;
  createdAt:         Date;
  updatedAt:         Date;
  quizId:            number;
  answers:           answers_Arena_gear[] | null;
  AnswerExplanation: null;
  type:              string;
}

export interface answers_Arena_gear {
  A_text: string | number;
}

export interface Arena_updated_data {
  id: string;
  numOfPlayers: number;
  adminId: string;
  hasStarted: boolean;
  roundTime: number;
  participants: participant;
  nominations: any;
  un_Solved_Quseions: any[];
  rankings: Ranks[] | null;
  results: any[];
  totalStages: number;
  currentStage: number;
}

export interface participant {
  [userId: string]: part;
}

export interface part {
  name: string;
  isOnline: boolean;
}

export interface Ranks {
  name: string;
  id: string;
  score: number;
  questions: number;
}

type NominationID = string;

export type Rankings = {
  [userID: string]: NominationID;
};

export interface ArenaQear {
  id: number;
  Q_imageUrl: null | string;
  Q_text: null | string;
  correctAnswer: null;
  subjectId: number;
  createdAt: Date;
  updatedAt: Date;
  quizId: number;
  answers: Answer[] | null;
  AnswerExplanation: null;
  type: string;
}

export interface Answer {
  A_text: string;
}

export interface Nominations {}


export interface OfflinePlayers {
  id: string;
  name: string | undefined;
}