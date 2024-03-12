import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function Profile() {
  const { currentUser } = useSelector((state: any) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [error, setError] = useState(false);
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
        setError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  return (
    <div className="p-3 m-4 max-w-lg mx-auto">
      <h1 className="text-4xl text-center">Profile</h1>
      <form
        action=""
        className="flex flex-col gap-8 mt-6
      "
      >
        <img
          //@ts-ignore
          src={formData.avatar || currentUser.avatar}
          alt="image"
          className="h-20 w-20 self-center rounded-full cursor-pointer"
          //@ts-ignore
          onClick={() => fileRef.current.click()}
        />
        <p className="text-center">
          {error ? (
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
          value={currentUser.username}
          className="p-3"
          placeholder="UserName"
        />
        <input
          type="email"
          value={currentUser.email}
          placeholder="Email"
          className="p-3"
        />
        <input type="password" placeholder="Password" className="p-3" />
        <button className="bg-slate-600 p-3 rounded-xl text-white">
          Update
        </button>
      </form>
      <div className="flex justify-between p-3 ">
        <span className="text-lg text-red-600 cursor-pointer">
          Delete Account
        </span>
        <span className="text-lg text-red-600 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
