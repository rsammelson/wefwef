import { IonActionSheet, IonLabel, IonList } from "@ionic/react";
import { InsetIonItem } from "../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setDefaultCommentSort } from "./appearanceSlice";
import { useState } from "react";
import { startCase } from "lodash";
import {
  ActionSheetButton,
  IonActionSheetCustomEvent,
  OverlayEventDetail,
} from "@ionic/core";
import { CommentDefaultSort, OCommentDefaultSort } from "../../../services/db";
import { ListHeader } from "./TextSize";

const BUTTONS: ActionSheetButton<CommentDefaultSort>[] = Object.values(
  OCommentDefaultSort
).map(function (postAppearanceType) {
  return {
    text: startCase(postAppearanceType),
    data: postAppearanceType,
  } as ActionSheetButton<CommentDefaultSort>;
});

export default function CollapsedByDefault() {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const defaultCommentSort = useAppSelector(
    (state) => state.appearance.comments.defaultCommentSort
  );

  return (
    <>
      <ListHeader>
        <IonLabel>Posts</IonLabel>
      </ListHeader>
      <IonList inset>
        <InsetIonItem button onClick={() => setOpen(true)}>
          <IonLabel>Post Size</IonLabel>
          <IonLabel slot="end" color="medium">
            {startCase(defaultCommentSort)}
          </IonLabel>
          <IonActionSheet
            cssClass="left-align-buttons"
            isOpen={open}
            onDidDismiss={() => setOpen(false)}
            onWillDismiss={(
              e: IonActionSheetCustomEvent<
                OverlayEventDetail<CommentDefaultSort>
              >
            ) => {
              if (e.detail.data) {
                dispatch(setDefaultCommentSort(e.detail.data));
              }
            }}
            header="Post Size"
            buttons={BUTTONS.map((b) => ({
              ...b,
              role: defaultCommentSort === b.data ? "selected" : undefined,
            }))}
          />
        </InsetIonItem>
      </IonList>
    </>
  );
}
