export interface UserData {
  is_logged_in: boolean;
  display_name?: string;
  images?: { url: string }[];
  id?: string;
}
