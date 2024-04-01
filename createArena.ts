export interface CreateArena {
  arena: Arena;
  accessToken: string;
}

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
}

export interface participant {
  [userId: string]: part;
}

export interface part {
  name: string;
  isOnline: boolean;
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
