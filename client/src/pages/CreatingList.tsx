import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function CreatingList() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [uploadingStatus, setUploadingStatus] = useState(false);
  const [imageError, setImageError] = useState("");
  console.log(uploadingStatus);
  console.log(formData);
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

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="font-semibold text-center text-3xl my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="p-2 border border-blue-300 rounded-lg"
            id="description"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="p-2 border border-blue-300 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="sale"
                id="sale"
              />
              <span className="">Sell</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="rent"
                id="rent"
              />
              <span className="">Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="parking"
                id="parking"
              />
              <span className="">Parking spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="furnished"
                id="furnished"
              />
              <span className="">Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="offer"
                id="offer"
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
              />
              <p className="ml-2">Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p className="ml-2">Regular Price</p>
                <span className="text-xs">($/Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p className="ml-2">Discounted Price</p>
                <span className="text-xs">($/Month)</span>
              </div>
            </div>
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
          <button className="bg-slate-600 p-3 rounded-lg text-white hover:opacity-90">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreatingList;
