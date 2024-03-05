import { Link } from "react-router-dom";

import { CiSearch } from "react-icons/ci";

function Header() {
  return (
    <>
      <header className="p-2 bg-slate-300 shadow-md">
        <div className="flex items-center justify-between max-w-6xl mx-auto p-2 ">
          <Link to="/">
            <h1 className="flex flex-wrap font-bold text-xl sm:text-2xl font-sans">
              <span className="text-gray-500">JOEY</span>
              <span className="text-gray-800">ESTATE</span>
            </h1>
          </Link>
          <form className="flex bg-slate-100 items-center p-2 rounded-lg">
            <input
              className=" w-28 sm:w-64 bg-transparent focus:outline-none"
              type="text"
              placeholder="Search...."
            />
            <CiSearch className="text-xl cursor-pointer" />
          </form>
          <ul className="flex sm:gap-10">
            <Link to="/">
              <li className="hidden sm:inline hover:text-blue-600">Home</li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline hover:text-blue-600">About</li>
            </Link>
            <Link to="/sign-in">
              <li className="hover:text-blue-600 cursor-pointer transition-colors ease-in-out">
                SignIn
              </li>
            </Link>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
