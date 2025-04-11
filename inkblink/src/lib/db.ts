import { doc, addDoc, collection, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createPost({
  prompt,
  linkedin_post = false,
  tweet = false,
  userId,
}: {
  prompt: string;
  linkedin_post?: boolean;
  tweet?: boolean;
  userId: string;
}) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error("User not found.");

  const user = userSnap.data();
  const inkbucks = user.inkbucks ?? 0;

  if (inkbucks <= 0) throw new Error("You do not have enough InkBucks.");

  // Subtract one InkBuck and create post
  await updateDoc(userRef, { inkbucks: inkbucks - 1 });

  const postRef = await addDoc(collection(db, "posts"), {
    prompt,
    linkedin_post,
    tweet,
    createdAt: new Date().toISOString(),
    userId,
  });

  return postRef.id;
}
