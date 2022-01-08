export class AppStringLiterals {
  public static readonly LEETCODE_SESSION_ENDPOINT =
    'https://leetcode.com/session/';
  public static readonly INTERCEPT_LEETCOD_URLS = [
    '*://*.leetcode.com/problem*',
    '*://*.leetcode.com/contest*',
  ];
  public static readonly LEETCODE_SESSION_ERROR =
    'failed to fetch sessions, please login to leetcode!';
}

export interface LeetResponse {
  sessions: Session[];
  is_full: boolean;
}

export interface Session {
  id: number;
  is_active: boolean;
  total_acs: number;
  name: string;
  ac_questions: number;
  submitted_questions: number;
  total_submitted: number;
}
