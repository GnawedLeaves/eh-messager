import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const deleteMessageFromUser = async (messageId, attachment_url) => {
  //TODO: Delete file from storage once the attachment feature is completed.

  // if (attachment_url !== null) {
  //   const messageStorageRef = ref(storage, `messages/${attachment_url}`);
  //   try {
  //     await deleteObject(messageStorageRef);
  //     console.log("file deleted from storage");
  //   } catch (e) {
  //     console.log("Error deleting attachment from storage: ", e);
  //   }
  // }

  if (messageId !== null) {
    const messageRecipientRef = collection(db, "message_recipient");
    const messageRef = collection(db, "message");
    const q = query(messageRecipientRef, where("message_id", "==", messageId));
    //delete message_recipient
    try {
      const querySnapshot = await getDocs(q);
      const deletePromises = [];

      querySnapshot.forEach((doc) => {
        // Collect all promises into an array
        deletePromises.push(deleteDoc(doc.ref));
      });

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);

      //delete message itself
      await deleteDoc(doc(messageRef, messageId));
    } catch (e) {
      console.log("Error deleting message ", e);
    }
  }
};
