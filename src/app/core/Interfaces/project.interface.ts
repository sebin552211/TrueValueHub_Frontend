import { Part } from "./Part.interface";

export interface Project {
  projectId?: number;
  projectName: string;
  projectDescription: string;
  createdDate: Date;
  parts: any[];
}
