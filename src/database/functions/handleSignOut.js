import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const handleSignOut = async () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("Sign out successful");
      return true;
    })
    .catch((error) => {
      console.log("Error when signing out: ", error);
      return false;
    });
};
