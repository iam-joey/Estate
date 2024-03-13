import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  deleteUserFail,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutUserStart,
  signOutuserSuccess,
  updateUserFail,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import { Link } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(
    (state: any) => state.user
  );
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [errorPicUpdate, setErrorPicUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: any) => {
    const storage = getStorage();
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.floor(progress));
      },
      (error) => {
        console.log(error);
        setErrorPicUpdating(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  console.log(formData);
  const handleFormChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSumbit = async (e: any) => {
    try {
      e.preventDefault();
      console.log("form data", formData);
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("data is", data);
      if (data.success === false) {
        dispatch(updateUserFail(data.message));
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      //setTimeout(() => setUpdateSuccess(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Error:", error);
      //@ts-ignore
      dispatch(updateUserFail(error.message));
    }
  };

  const deleteHandler = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("data is", data);
      if (data.success === false) {
        dispatch(deleteUserFail(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.error("Error:", error);
      //@ts-ignore
      dispatch(deleteUserFail(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutuserSuccess());
    } catch (error) {
      //@ts-ignore
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <div className="p-3 m-4 max-w-lg mx-auto">
      <h1 className="text-4xl text-center">Profile</h1>
      <form
        onSubmit={handleSumbit}
        action=""
        className="flex flex-col gap-5 mt-6
      "
      >
        <img
          //@ts-ignore
          src={formData.avatar || currentUser.avatar}
          alt="image"
          className="h-32 w-32 self-center rounded-full cursor-pointer"
          //@ts-ignore
          onClick={() => fileRef.current.click()}
        />
        <p className="text-center">
          {errorPicUpdate ? (
            <span className="text-red-600">Error while uploading file</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-blue-600">
              Uploading... {filePercentage}%
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-600">File uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => {
            //@ts-ignore
            setFile(e.target.files[0]);
          }}
          className="self-center hidden"
          accept="image/*"
        />
        <input
          type="text"
          defaultValue={currentUser.username}
          className="p-3"
          placeholder="UserName"
          onChange={handleFormChange}
          id="username"
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="p-3"
          onChange={handleFormChange}
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3"
          onChange={handleFormChange}
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-600 p-3 rounded-xl text-white hover:opacity-95 disabled:opacity-80 uppercase"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="p-3 text-center text-white bg-green-600 rounded-lg hover:opacity-90"
        >
          Create Link
        </Link>
      </form>
      <p className="text-center text-green-600 mt-2">
        {updateSuccess && "Updated Successfully"}
      </p>
      <div className="flex justify-between p-3 ">
        <span
          onClick={deleteHandler}
          className="text-lg text-red-600 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignout}
          className="text-lg text-red-600 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default Profile;
