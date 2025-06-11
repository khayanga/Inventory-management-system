export type Officer = {
  id: string;
  militaryId: string;
  name: string;
  rank: string;
  unit: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
};

export type OfficerFormValues = Omit<Officer, "id" | "createdAt" | "updatedAt">;