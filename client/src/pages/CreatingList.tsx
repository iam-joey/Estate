function CreatingList() {
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
            //@ts-ignore
            maxLength="62"
            //@ts-ignore
            minLength="10"
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
            <div className=" flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="sale"
                id="sale"
              />
              <span className="">Sell</span>
            </div>

            <div className=" flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="rent"
                id="sale"
              />
              <span className="">Rent</span>
            </div>
            <div className=" flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="parking"
                id="parking"
              />
              <span className="">Parking spot</span>
            </div>
            <div className=" flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="furnished"
                id="furnished"
              />
              <span className="">Furnished</span>
            </div>
            <div className=" flex items-center gap-2">
              <input
                className="w-5 h-5"
                type="checkbox"
                name="sale"
                id="sale"
              />
              <span className="">Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p className="ml-2">Beds</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p className="ml-2">Bathrooms</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p className="ml-2">Regular Price</p>
                <span className="text-xs">($/Month)</span>
              </div>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                min="1"
                max="10"
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
              className="border border-slate-200 p-4 w-full rounded-r-lg"
            />
            <button className="border border-green-400 p-4 rounded-lg text-green-500 uppercase hover:shadow-md hover:opacity-95">
              Upload
            </button>
          </div>
          <button className="bg-slate-600 p-3 rounded-lg text-white hover:opacity-90">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreatingList;
