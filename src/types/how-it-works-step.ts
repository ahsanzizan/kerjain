export interface Step {
  order: number;
  title: string;
  points: { worker: string[]; employer: string[] };
}
