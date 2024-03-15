import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreatingList() {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });
  const [uploadingStatus, setUploadingStatus] = useState(false);
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const handleonchange = (e: any) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
        // Set discountedPrice to zero if Offer is unchecked
        discountedPrice:
          e.target.id === "offer" && !e.target.checked
            ? 0
            : formData.discountedPrice,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleUploadImage = () => {
    if (
      imageFiles.length > 0 &&
      imageFiles.length + formData.imageUrls.length <= 6
    ) {
      setUploadingStatus(true);
      setImageError("");
      const promiseImageUrls: Promise<string>[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        promiseImageUrls.push(uploadFileToFireBase(imageFiles[i]));
      }

      Promise.all(promiseImageUrls)
        .then((urls) => {
          setFormData({
            ...formData,
            //@ts-ignore
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploadingStatus(false); // Update uploading status after successful upload
        })
        .catch((error) => {
          setUploadingStatus(false);
          setImageError(error);
        });
      setUploadingStatus(false);
    } else {
      setImageError("You can only upload 6 images");
      setUploadingStatus(false);
    }
  };

  const uploadFileToFireBase = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteUploadedImage = (index: any) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    if (formData.imageUrls.length === 0) {
      return setSubmitError("Please upload at least one image");
    }
    if (formData.regularPrice < formData.discountedPrice) {
      return setSubmitError(
        "Discounted price cannot be greater than regular price"
      );
    }
    setLoading(true);
    const res = await fetch("/api/listing/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
    });
    const data = await res.json();
    if (data.success === false) {
      setLoading(false);
      setSubmitError(data.message);
    }
    setLoading(false);
    navigate(`/listing/${data._id}`);
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="font-semibold text-center text-3xl my-7">
        Create Listing
      </h1>
      <form onSubmit={handleSubmitForm} className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleonchange}
            value={formData.name}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="p-2 border border-blue-300 rounded-lg"
            id="description"
            required
            onChange={handleonchange}
            value={formData.description}
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="p-2 border border-blue-300 rounded-lg"
            id="address"
            required
            onChange={handleonchange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="sale"
                id="sale"
                onChange={handleonchange}
                checked={formData.type === "sale"}
              />
              <span className="">Sell</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="rent"
                id="rent"
                onChange={handleonchange}
                checked={formData.type === "rent"}
              />
              <span className="">Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="parking"
                id="parking"
                onChange={handleonchange}
                checked={formData.parking}
              />
              <span className="">Parking spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="furnished"
                id="furnished"
                onChange={handleonchange}
                checked={formData.furnished}
              />
              <span className="">Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="offer"
                id="offer"
                onChange={handleonchange}
                checked={formData.offer}
              />
              <span className="">Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleonchange}
                value={formData.bedrooms}
              />
              <p className="ml-2">Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleonchange}
                value={formData.bathrooms}
              />
              <p className="ml-2">Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={50}
                max={100000}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleonchange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p className="ml-2">Regular Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($/Month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min={0}
                  max={1000000}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleonchange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="ml-2">Discounted Price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($/Month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 p-3">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className=" flex justify-between gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setImageFiles(Array.from(e.target.files || []));
              }}
              className="border border-slate-200 p-4 w-full rounded-r-lg"
            />

            <button
              type="button"
              disabled={uploadingStatus}
              onClick={handleUploadImage}
              className="border border-green-400 p-4 rounded-lg text-green-500 uppercase hover:shadow-md hover:opacity-75 disabled:opacity-80 text-white bg-green-700"
            >
              {uploadingStatus ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageError && (
            <div className="text-red-700 text-sm">{imageError}</div>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between ">
                <img
                  key={index}
                  src={url}
                  alt="image"
                  className="h-14 w-14 object-cover rounded-lg"
                />
                <button
                  type="button"
                  //@ts-ignore
                  onClick={() => handleDeleteUploadedImage(index)}
                  className="text-red-700 text-sm uppercase hover:opacity-95"
                >
                  delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploadingStatus}
            className="bg-slate-600 p-3 rounded-lg text-white hover:opacity-90 disabled:opacity-75"
          >
            {loading ? "Loading..." : "Create Listing"}
          </button>
          {submitError && <p className="text-red-600">{submitError}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreatingList;
