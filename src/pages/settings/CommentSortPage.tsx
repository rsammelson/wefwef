import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AppContent from "../../features/shared/AppContent";
import PostsViewSelection from "../../features/settings/appearance/posts/PostsViewSelection";
import CommentDefaultSortSelection from "../../features/settings/appearance/comments/CommentDefaultSortSelection";

export default function CommentSortPage() {
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/settings/appearance"
              text="Appearance"
            />
          </IonButtons>

          <IonTitle>Comments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <CommentDefaultSortSelection />
      </AppContent>
    </IonPage>
  );
}
