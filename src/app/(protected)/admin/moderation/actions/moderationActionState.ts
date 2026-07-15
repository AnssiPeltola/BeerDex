export type ModerationActionState = {
  success: boolean;
  message: string;
  status: "approved" | "rejected" | null;
};

export const initialModerationActionState: ModerationActionState = {
  success: false,
  message: "",
  status: null,
};
