import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res);
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: res.user.displayName,
          photo: res.user.photoURL,
          email: res.user.email,
        }),
      });
      const data = await response.json();

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      //@ts-ignore
      console.error("Authentication error:", error.code, error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="bg-red-700 p-2 rounded-lg text-white uppercase"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
