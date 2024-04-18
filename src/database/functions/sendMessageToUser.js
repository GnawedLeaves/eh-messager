import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const sendMessageToUser = async (
  creatorId,
  recipientId,
  messageBody,
  attachment,
  parentMessageId
) => {
  const messageRef = collection(db, "message");
  const messageRecipientRef = collection(db, "message_recipient");
  let attachmentUrl = null;

  if (messageBody !== "") {
    if (attachment !== null) {
      try {
        // Check if an attachment is provided
        if (attachment) {
          // Get a reference to the storage location and the path where the file is saved
          const fileRef = ref(storage, `messages/${attachment}`);

          // Upload the file to Firebase Storage
          await uploadBytes(fileRef, attachment);
          // Get the download URL of the uploaded file
          attachmentUrl = await getDownloadURL(fileRef);
          console.log("File uploaded successfully!", attachmentUrl);
        }
      } catch (e) {
        console.log("Error uploading file to firebase", e);
      }
    }
    try {
      // Add to message table
      const timestamp = Timestamp.fromDate(new Date());
      const messageDocRef = await addDoc(messageRef, {
        creator_id: creatorId,
        date_created: timestamp,
        message_body: messageBody,
        attachment_url: attachmentUrl,
        parent_message_id: parentMessageId,
        expiry_date: null,
        subject: null,
      });
      const messageId = messageDocRef.id;
      console.log("sent message id: ", messageId);

      const messageRecipientDocRef = await addDoc(messageRecipientRef, {
        is_read: false,
        message_id: messageId,
        recipient_group_id: null,
        recipient_id: recipientId,
      });
      console.log("Message successfully added");

      // Add to message_recipient table
    } catch (e) {
      console.log("Error sending message to user: ", e);
    }
  }
};
