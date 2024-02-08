import { IUser } from "./Login";

export interface LinkFormState {
  description: string;
  url: string;
}
export interface IVote {
  id: string;
  user: IUser;
}
export interface ILink {
  __typename: string;
  id: string;
  createdAt: string;
  url: string;
  description: string;
  postedBy: IUser;
  votes: getList<IVote>;
}

// generic example
type getList<T> = T[];

export interface IFeed {
  id: string;
  links: getList<ILink>;
  count: number;
}

export interface ICachedLinksData {
  feed: IFeed;
}
