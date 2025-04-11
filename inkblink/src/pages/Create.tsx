import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { createPost } from "@/lib/db";
import TweetCard from "@/components/TweetCard";

export default function Create() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const promptFromURL = searchParams.get("prompt");
  const platformsFromURL = searchParams.get("platforms") || "";
  const user = getAuth().currentUser;

  const [showTweetCard, setShowTweetCard] = useState(false);
  const [decodedPrompt, setDecodedPrompt] = useState("");

  // Save post on mount
  useEffect(() => {
    const savePrompt = async () => {
      try {
        if (promptFromURL && user?.uid) {
          const decoded = decodeURIComponent(promptFromURL);
          setDecodedPrompt(decoded);
          setShowTweetCard(platformsFromURL.includes("twitter"));

          const newPostId = await createPost({
            prompt: decoded,
            linkedin_post: platformsFromURL.includes("linkedin"),
            tweet: platformsFromURL.includes("twitter"),
            userId: user.uid,
          });

          console.log("Saved post with ID:", newPostId);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to save your post.");
      }
    };

    savePrompt();
  }, [promptFromURL, platformsFromURL, user]);

  return (
    <div className="container mx-auto mt-16 text-primary">
      {decodedPrompt && (
        <div className="rounded-md bg-primary/5 p-4 mb-8 border border-primary/20">
          <p className="text-center font-display text-primary/70 text-xl">
            "{decodedPrompt}"
          </p>
        </div>
      )}

      {showTweetCard && (
        <TweetCard tweet={decodedPrompt} />
      )}
    </div>
  );
}
