// Task types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: number; // 0-3
  status: number; // 0-4
  progress: number; // 0-100
  createdAt: Date;
  completedAt: Date | null;
  projectId: number | null;
}

export interface TaskInput {
  title: string;
  description?: string;
  priority: number;
  status: number;
  progress?: number;
  projectId?: number;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  priority?: number;
  status?: number;
  progress?: number;
  projectId?: number;
}

// Project types
export interface Project {
  id: number;
  title: string;
  description: string | null;
}

export interface ProjectInput {
  title: string;
  description?: string;
}

export interface ProjectUpdateInput {
  title?: string;
  description?: string;
}

// Tag types
export interface Tag {
  id: number;
  title: string;
}

export interface TagInput {
  title: string;
}

export interface TagUpdateInput {
  title?: string;
}

// Associated types
export interface TaskWithRelations extends Task {
  project?: Project | null;
  tags?: Tag[];
}

export interface ProjectWithRelations extends Project {
  tasks?: Task[];
}

export interface TagWithRelations extends Tag {
  tasks?: Task[];
}
