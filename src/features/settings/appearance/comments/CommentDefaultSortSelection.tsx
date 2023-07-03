import { IonList, IonRadio, IonRadioGroup } from "@ionic/react";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { InsetIonItem } from "../../../user/Profile";
import {OCommentDefaultSort, setDefaultCommentSort} from "../appearanceSlice";

export default function CommentDefaultSortSelection() {
  const dispatch = useAppDispatch();
  const defaultCommentSort = useAppSelector(
    (state) => state.appearance.comments.defaultCommentSort
  );

  return (
    <IonRadioGroup
      value={defaultCommentSort}
      onIonChange={(e) => {
        dispatch(setDefaultCommentSort(e.target.value));
      }}
    >
      <IonList inset>
        <InsetIonItem>
          <IonRadio value={OCommentDefaultSort.Hot}>Hot</IonRadio>
        </InsetIonItem>
        <InsetIonItem>
          <IonRadio value={OCommentDefaultSort.Top}>Top</IonRadio>
        </InsetIonItem>
        <InsetIonItem>
          <IonRadio value={OCommentDefaultSort.New}>New</IonRadio>
        </InsetIonItem>
        <InsetIonItem>
          <IonRadio value={OCommentDefaultSort.Old}>Old</IonRadio>
        </InsetIonItem>
      </IonList>
    </IonRadioGroup>
  );
}
