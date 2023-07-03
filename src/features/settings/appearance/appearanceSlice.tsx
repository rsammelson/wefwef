import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { get, set } from "../storage";
import { merge } from "lodash";
import { RootState } from "../../../store";
import { MAX_DEFAULT_COMMENT_DEPTH } from "../../../helpers/lemmy";

const STORAGE_KEYS = {
  FONT: {
    FONT_SIZE_MULTIPLIER: "appearance--font-size-multiplier",
    USE_SYSTEM: "appearance--font-use-system",
  },
  COMMENTS: {
    COLLAPSE_COMMENT_THREADS: "appearance--collapse-comment-threads",
    DEFAULT_COMMENT_SORT: "appearance--default-comment-sort"
  },
  POSTS: {
    TYPE: "appearance--post-type",
  },
  DARK: {
    USE_SYSTEM: "appearance--dark-use-system",
    USER_MODE: "appearance--dark-user-mode",
  },
} as const;

export const OPostAppearanceType = {
  Compact: "compact",
  Large: "large",
} as const;

export type PostAppearanceType =
  (typeof OPostAppearanceType)[keyof typeof OPostAppearanceType];

export const OCommentThreadCollapse = {
  Always: "always",
  Never: "never",
  // TODO- remember per subreddit
} as const;

export type CommentThreadCollapse =
    (typeof OCommentThreadCollapse)[keyof typeof OCommentThreadCollapse];

export const OCommentDefaultSort = {
  Hot: "Hot",
  Top: "Top",
  New: "New",
  Old: "Old"
} as const;

export type CommentSortDefault =
    (typeof OCommentDefaultSort)[keyof typeof  OCommentDefaultSort];

interface AppearanceState {
  font: {
    fontSizeMultiplier: number;
    useSystemFontSize: boolean;
  };
  comments: {
    collapseCommentThreads: CommentThreadCollapse;
    defaultCommentSort: CommentSortDefault;
  };
  posts: {
    type: PostAppearanceType;
  };
  dark: {
    usingSystemDarkMode: boolean;
    userDarkMode: boolean;
  };
}

const initialState: AppearanceState = {
  font: {
    fontSizeMultiplier: 1,
    useSystemFontSize: false,
  },
  comments: {
    collapseCommentThreads: OCommentThreadCollapse.Never,
    defaultCommentSort: OCommentDefaultSort.Hot,
  },
  posts: {
    type: OPostAppearanceType.Large,
  },
  dark: {
    usingSystemDarkMode: true,
    userDarkMode: false,
  },
};

const stateFromStorage: AppearanceState = merge(initialState, {
  font: {
    fontSizeMultiplier: get(STORAGE_KEYS.FONT.FONT_SIZE_MULTIPLIER),
    useSystemFontSize: get(STORAGE_KEYS.FONT.USE_SYSTEM),
  },
  comments: {
    collapseCommentThreads: get(STORAGE_KEYS.COMMENTS.COLLAPSE_COMMENT_THREADS),
    defaultCommentSort: get(STORAGE_KEYS.COMMENTS.DEFAULT_COMMENT_SORT),
  },
  posts: {
    type: get(STORAGE_KEYS.POSTS.TYPE),
  },
  dark: {
    usingSystemDarkMode: get(STORAGE_KEYS.DARK.USE_SYSTEM),
    userDarkMode: get(STORAGE_KEYS.DARK.USER_MODE),
  },
});

export const defaultCommentDepthSelector = createSelector(
  [(state: RootState) => state.appearance.comments.collapseCommentThreads],
  (collapseCommentThreads): number => {
    switch (collapseCommentThreads) {
      case OCommentThreadCollapse.Always:
        return 1;
      case OCommentThreadCollapse.Never:
        return MAX_DEFAULT_COMMENT_DEPTH;
    }
  }
);

export const appearanceSlice = createSlice({
  name: "appearance",
  initialState: stateFromStorage,
  reducers: {
    setFontSizeMultiplier(state, action: PayloadAction<number>) {
      state.font.fontSizeMultiplier = action.payload;

      set(STORAGE_KEYS.FONT.FONT_SIZE_MULTIPLIER, action.payload);
    },
    setUseSystemFontSize(state, action: PayloadAction<boolean>) {
      state.font.useSystemFontSize = action.payload;

      set(STORAGE_KEYS.FONT.USE_SYSTEM, action.payload);
    },
    setCommentsCollapsed(state, action: PayloadAction<CommentThreadCollapse>) {
      state.comments.collapseCommentThreads = action.payload;

      set(STORAGE_KEYS.COMMENTS.COLLAPSE_COMMENT_THREADS, action.payload);
    },
    setDefaultCommentSort(state, action: PayloadAction<CommentSortDefault>) {
      state.comments.defaultCommentSort = action.payload;

      set(STORAGE_KEYS.COMMENTS.DEFAULT_COMMENT_SORT, action.payload)
    },
    setPostAppearance(state, action: PayloadAction<PostAppearanceType>) {
      state.posts.type = action.payload;

      set(STORAGE_KEYS.POSTS.TYPE, action.payload);
    },
    setUserDarkMode(state, action: PayloadAction<boolean>) {
      state.dark.userDarkMode = action.payload;

      set(STORAGE_KEYS.DARK.USER_MODE, action.payload);
    },
    setUseSystemDarkMode(state, action: PayloadAction<boolean>) {
      state.dark.usingSystemDarkMode = action.payload;

      set(STORAGE_KEYS.DARK.USE_SYSTEM, action.payload);
    },

    resetAppearance: () => initialState,
  },
});

export const {
  setFontSizeMultiplier,
  setUseSystemFontSize,
  setCommentsCollapsed,
  setDefaultCommentSort,
  setPostAppearance,
  setUserDarkMode,
  setUseSystemDarkMode,
} = appearanceSlice.actions;

export default appearanceSlice.reducer;
