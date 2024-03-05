import { Link } from "react-router-dom";

function SignUp() {
  return (
    <>
      <div className="  max-w-lg mx-auto p-3">
        <h1 className="text-4xl text-center my-6">SignUp</h1>
        <form action="" className="flex flex-col gap-4  0 p-2">
          <input
            type="text"
            className="p-2 rounded-lg"
            placeholder="Enter your Name"
          />
          <input
            type="email"
            className="p-2 rounded-lg"
            placeholder="Enter your email"
          />
          <input
            type="password"
            className="p-2 rounded-lg"
            placeholder="Enter your password"
          />
          <button className="rounded-lg  text-white bg-slate-700 p-2 hover:opacity-80 mt-2 disabled:opacity-40 uppercase">
            Sign Up
          </button>
        </form>
        <div className="p-3 flex gap-2 items-center">
          <p className="">Have an Account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700 cursor-pointer">Sign In</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SignUp;
