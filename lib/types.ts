export type Candidate = {
  id: number;
  timestamp: string;
  name?: string;
  contactInfo?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  projects?: string[];
  yearsOfExperience: number,
  educationLevel: string,
  location: string,
};

export type SummarySections = {
  name?: string;
  contactInfo?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  projects?: string[];
  yearsOfExperience: number,
  educationLevel: string,
  location: string,
};

export type Maybe<T> = T | null | undefined;