import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);
      console.log(data.success);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-3">
        <h1 className="text-4xl text-center my-6">SignUp</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 0 p-2">
          <input
            type="text"
            className="p-3 rounded-lg"
            placeholder="Enter your Name"
            onChange={handleChange}
            id="username"
          />
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <div className="p-3 flex gap-2 items-center">
          <p className="">Have an Account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700 cursor-pointer">Sign In</span>
          </Link>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </>
  );
}

export default SignUp;
