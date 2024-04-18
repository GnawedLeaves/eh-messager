import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const getAllMessageFromUser = async (userId, otherId) => {
  if (userId !== null && otherId !== null) {
    let allMessages = [];
    const messageRecipientRef = collection(db, "message_recipient");
    const messageRef = collection(db, "message");
    try {
      const idsOfRecievedMessagesQuery = query(
        messageRecipientRef,
        where("recipient_id", "==", userId)
      );

      const idsOfSentMessagesQuery = query(
        messageRecipientRef,
        where("recipient_id", "==", otherId)
      );
      const receivedMessagesSnapshot = await getDocs(
        idsOfRecievedMessagesQuery
      );
      const sentMessagesSnapshot = await getDocs(idsOfSentMessagesQuery);

      const allReceivedAndSentMessages = [
        ...receivedMessagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        ...sentMessagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      ];
      console.log("allReceivedAndSentMessagesIds", allReceivedAndSentMessages);

      //get messages based on the ids
    } catch (e) {
      console.log("Error getting messages: ", e);
    }

    return allMessages;
  } else {
    console.log("Missing userid or otherid");
  }
};
