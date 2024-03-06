import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {
  const [form, setForm] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFail(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error: any) {
      dispatch(signInFail(error.message));
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-3">
        <h1 className="text-4xl text-center my-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 0 p-2">
          <input
            type="email"
            className="p-3 rounded-lg"
            placeholder="Enter your email"
            onChange={handleChange}
            id="email"
          />
          <input
            type="password"
            className="p-3 rounded-lg"
            placeholder="Enter your password"
            onChange={handleChange}
            id="password"
          />
          <button
            className={`rounded-lg text-white bg-slate-700 p-2 hover:opacity-80 mt-2 ${
              loading ? "disabled:opacity-40 cursor-not-allowed" : ""
            } uppercase`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="p-3 flex gap-2 items-center">
          <p className="">Dont an Account?</p>
          <Link to="/sign-up">
            <span className="text-blue-700 cursor-pointer">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </>
  );
}

export default SignIn;
