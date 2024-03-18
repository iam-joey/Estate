import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }: any) {
  const [landlord, setLandlord] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onChange = (e: any) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${listing.userRef}`);
        if (!res.ok) {
          throw new Error("Failed to fetch landlord data");
        }
        const data = await res.json();
        setLandlord(data);
        setLoading(false);
      } catch (error) {
        //@ts-ignore
        setError(error.message);
        setLoading(false);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            //@ts-ignore
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
            aria-label="Enter your message here"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
