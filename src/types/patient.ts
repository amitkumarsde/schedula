export type FileLink = {
  name: string;
  url: string;
};

export type Patient = {
  _id: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  profileImage: string;
  mobileNumber: string;
  bloodGroup: string;
  weight: number;
  city: string;
  allergies: string[];
  diseases: string[];
  documents: FileLink[];
  testReports: FileLink[];
};
