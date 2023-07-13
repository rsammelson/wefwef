import { IonLabel, IonList } from "@ionic/react";
import { InsetIonItem } from "../../../pages/profile/ProfileFeedItemsPage";
import { useAppSelector } from "../../../store";
import { startCase } from "lodash";

export default function DefaultCommentSort() {
  const defaultCommentSort = useAppSelector(
    (state) => state.appearance.comments.defaultCommentSort
  );

  return (
    <>
      <IonList inset>
        <InsetIonItem routerLink="/settings/appearance/comments">
          <IonLabel>Default Comment Sort</IonLabel>
          <IonLabel slot="end" color="medium">
            {startCase(defaultCommentSort)}
          </IonLabel>
        </InsetIonItem>
      </IonList>
    </>
  );
}
