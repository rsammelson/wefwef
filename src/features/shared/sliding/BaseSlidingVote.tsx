import { useIonToast } from "@ionic/react";
import {
  arrowDownSharp,
  arrowUndo,
  arrowUpSharp,
  bookmarkOutline,
  chevronCollapse,
  chevronExpand,
  eyeOffOutline,
  eyeOutline,
  mailUnread,
} from "ionicons/icons";
import React, { useCallback, useContext, useMemo } from "react";
import SlidingItem, { SlidingItemAction } from "./SlidingItem";
import {
  CommentReplyView,
  CommentView,
  PersonMentionView,
  PostView,
} from "lemmy-js-client";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  postHiddenByIdSelector,
  savePost,
  voteOnPost,
} from "../../post/postSlice";
import { voteError } from "../../../helpers/toastMessages";
import { saveComment, voteOnComment } from "../../comment/commentSlice";
import { PageContext } from "../../auth/PageContext";
import { SwipeAction, SwipeActions } from "../../../services/db";
import useCollapseRootComment from "../../comment/useCollapseRootComment";
import { getInboxItemId, markRead } from "../../inbox/inboxSlice";
import { InboxItemView } from "../../inbox/InboxItem";
import { CommentsContext } from "../../comment/CommentsContext";

interface BaseSlidingVoteProps {
  children: React.ReactNode;
  className?: string;
  item: CommentView | PostView | PersonMentionView | CommentReplyView;
  rootIndex?: number;
  collapsed?: boolean;
  actions: SwipeActions;
  onHide?: () => void;
}

export default function BaseSlidingVote({
  children,
  className,
  item,
  rootIndex,
  collapsed,
  actions,
  onHide,
}: BaseSlidingVoteProps) {
  const { presentLoginIfNeeded, presentCommentReply } = useContext(PageContext);
  const { prependComments } = useContext(CommentsContext);

  const [present] = useIonToast();
  const dispatch = useAppDispatch();

  const postVotesById = useAppSelector((state) => state.post.postVotesById);
  const commentVotesById = useAppSelector(
    (state) => state.comment.commentVotesById
  );
  const typedMyVote = item.my_vote as 1 | -1 | 0 | undefined;
  const isPost = "unread_comments" in item;
  const currentVote = isPost
    ? postVotesById[item.post.id] ?? typedMyVote
    : commentVotesById[item.comment.id] ?? typedMyVote;

  const postSavedById = useAppSelector((state) => state.post.postSavedById);
  const commentSavedById = useAppSelector(
    (state) => state.comment.commentSavedById
  );

  const isHidden = useAppSelector(postHiddenByIdSelector)[item.post?.id];

  const readByInboxItemId = useAppSelector(
    (state) => state.inbox.readByInboxItemId
  );

  const vote = useCallback(
    async (score: 1 | -1 | 0) => {
      if (presentLoginIfNeeded()) return;

      try {
        if (isPost) await dispatch(voteOnPost(item.post.id, score));
        else await dispatch(voteOnComment(item.comment.id, score));
      } catch (error) {
        present(voteError);
      }
    },
    [dispatch, isPost, item, present, presentLoginIfNeeded]
  );

  const reply = useCallback(async () => {
    if (presentLoginIfNeeded()) return;
    const reply = await presentCommentReply(item);
    if (!isPost && reply) prependComments([reply]);
  }, [
    item,
    isPost,
    presentCommentReply,
    presentLoginIfNeeded,
    prependComments,
  ]);

  const { id, isSaved } = useMemo(() => {
    if (isPost) {
      const id = item.post.id;
      return { id: id, isSaved: postSavedById[id] };
    } else {
      const id = item.comment.id;
      return { id: id, isSaved: commentSavedById[id] };
    }
  }, [item, isPost, postSavedById, commentSavedById]);

  const save = useCallback(async () => {
    if (presentLoginIfNeeded()) return;
    try {
      await dispatch((isPost ? savePost : saveComment)(id, !isSaved));
    } catch (error) {
      present({
        message: "Failed to mark item as saved",
        duration: 3500,
        position: "bottom",
        color: "danger",
      });
      throw error;
    }
  }, [presentLoginIfNeeded, dispatch, isPost, id, isSaved, present]);

  const saveAction = useMemo(() => {
    return {
      icon: bookmarkOutline,
      trigger: save,
      bgColor: "success",
      slash: isSaved,
    };
  }, [save, isSaved]);

  const hideAction = useMemo(() => {
    return onHide
      ? {
          icon: isHidden ? eyeOutline : eyeOffOutline,
          trigger: () => {
            if (presentLoginIfNeeded()) return;
            onHide();
          },
          bgColor: isHidden ? "tertiary" : "danger",
        }
      : undefined;
  }, [presentLoginIfNeeded, isHidden, onHide]);

  const collapseRootComment = useCollapseRootComment(
    !isPost ? item : undefined,
    rootIndex
  );
  const collapseAction = useMemo(() => {
    return collapseRootComment
      ? {
          icon: collapsed ? chevronExpand : chevronCollapse,
          trigger: collapseRootComment,
          bgColor: "tertiary",
        }
      : undefined;
  }, [collapsed, collapseRootComment]);

  const isRead = useMemo(() => {
    return readByInboxItemId[getInboxItemId(item as InboxItemView)] ?? false;
  }, [item, readByInboxItemId]);

  const markUnread = useCallback(async () => {
    try {
      await dispatch(markRead(item as InboxItemView, !isRead));
    } catch (error) {
      present({
        message: "Failed to mark item as unread",
        duration: 3500,
        position: "bottom",
        color: "danger",
      });
      throw error;
    }
  }, [dispatch, present, item, isRead]);

  const markUnreadAction = useMemo(() => {
    return {
      icon: mailUnread,
      trigger: markUnread,
      bgColor: "primary",
      slash: !isRead,
    };
  }, [markUnread, isRead]);

  const all_actions: {
    [id in SwipeAction]: SlidingItemAction | undefined;
  } = useMemo(() => {
    return {
      none: undefined,
      upvote: {
        icon: arrowUpSharp,
        trigger: () => {
          vote(currentVote === 1 ? 0 : 1);
        },
        bgColor: "primary",
        slash: currentVote === 1,
      },
      downvote: {
        icon: arrowDownSharp,
        trigger: () => {
          vote(currentVote === -1 ? 0 : -1);
        },
        bgColor: "danger",
        slash: currentVote === -1,
      },
      reply: {
        icon: arrowUndo,
        trigger: reply,
        bgColor: "primary",
      },
      save: saveAction,
      hide: hideAction,
      collapse: collapseAction,
      mark_unread: markUnreadAction,
    };
  }, [
    currentVote,
    reply,
    saveAction,
    hideAction,
    collapseAction,
    markUnreadAction,
    vote,
  ]);

  return (
    <SlidingItem
      startActions={[
        all_actions[actions["start"]],
        all_actions[actions["far_start"]],
      ]}
      endActions={[
        all_actions[actions["end"]],
        all_actions[actions["far_end"]],
      ]}
      className={className}
    >
      {children}
    </SlidingItem>
  );
}
