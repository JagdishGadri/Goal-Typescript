import { IUser } from "./Login";

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
  votes: [IVote];
}

export interface IFeed {
  id: string;
  links: [ILink];
  count: number;
}

export interface ICachedLinksData {
  feed: IFeed;
}
