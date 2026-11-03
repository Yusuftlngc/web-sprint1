export const EVENT_CATEGORIES = ["Seminer", "Atölye", "Söyleşi", "Yarışma"] as const;

export type Category = (typeof EVENT_CATEGORIES)[number];

export interface CampusEvent {
  id: string;
  title: string;
  category: Category;
  capacity: number;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
}

export type EventFormData = Omit<CampusEvent, "id" | "capacity" | "category"> & {
  capacity: string;
  category: Category | "";
};

export type EventFormErrors = Partial<Record<keyof EventFormData, string>>;
