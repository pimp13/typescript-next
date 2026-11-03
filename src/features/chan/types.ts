export type ChanBoard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isNsfw: boolean;
  isActive: boolean;
  isWorksafe: boolean;
  bumpLimit: number;
  threadLimit: number;
  maxFileSizeMb: number;
  forceImage: boolean;
  postCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: { threads: number };
};

export type ChanPost = {
  id: string;
  boardId: string;
  threadId: string;
  number: number;
  isOp: boolean;
  name: string;
  tripcode: string | null;
  comment: string;
  fileName: string | null;
  fileUrl: string | null;
  fileMime: string | null;
  fileSize: number | null;
  fileWidth: number | null;
  fileHeight: number | null;
  isSpoiler: boolean;
  createdAt: string;
};

export type ChanThreadSummary = {
  id: string;
  boardId: string;
  subject: string | null;
  isSticky: boolean;
  isLocked: boolean;
  replyCount: number;
  imageCount: number;
  bumpedAt: string;
  createdAt: string;
  op: ChanPost | null;
  lastReplies: ChanPost[];
};

export type ChanThreadListResponse = {
  board: ChanBoard;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  threads: ChanThreadSummary[];
};

export type ChanThreadDetail = {
  board: ChanBoard;
  thread: {
    id: string;
    boardId: string;
    subject: string | null;
    isSticky: boolean;
    isLocked: boolean;
    replyCount: number;
    imageCount: number;
    bumpedAt: string;
    createdAt: string;
    posts: ChanPost[];
  };
};
