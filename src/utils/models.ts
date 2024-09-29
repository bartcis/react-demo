export interface User {
  avatarUrl?: string;
  eventsUrl?: string;
  followersUrl?: string;
  followingUrl?: string;
  gistsUrl?: string;
  gravatarId?: string;
  htmlUrl?: string;
  id: number;
  login: string;
  nodeId?: string;
  organizationsUrl?: string;
  receivedEventsUrl?: string;
  reposUrl?: string;
  score: number;
  siteAdmin: boolean;
  starredUrl?: string;
  subscriptionsUrl?: string;
  type: string;
  url: string;
}

export interface Page {
  incompleteResults: boolean;
  totalCount: number;
  items: User[];
  message?: string;
}
