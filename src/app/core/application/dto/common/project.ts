export interface IProject {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    organizer: {
      name: string;
    };
  }