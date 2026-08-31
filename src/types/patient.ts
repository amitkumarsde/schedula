// One patient profile as the API sends it.
export type Patient = {
  _id: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  profileImage: string;
  mobileNumber: string;
  weight: number;
  bloodGroup: string;
  city: string;
};
