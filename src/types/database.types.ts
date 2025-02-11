
export type Tournament = {
  id: string;
  title: string;
  banner_url: string;
  status: "in-progress" | "closed" | "completed" | "upcoming";
  max_participants: number;
  current_participants: number;
  prize_pool: number;
  start_date: string;
  created_at: string;
  updated_at: string;
};
