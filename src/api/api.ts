// api.ts
import { db } from '../firebase'; // Adjust the import if needed
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Deletes a product (item) and all sponsorships tied to it.
 * @param itemId The Firestore document ID of the item to delete.
 */
export async function deleteProductAndSponsorships(itemId: string) {
  // 1. Delete the product
  await deleteDoc(doc(db, "items", itemId));

  // 2. Find and delete all sponsorships for this product
  const sponsorshipsQuery = query(
    collection(db, "sponsorships"),
    where("itemId", "==", itemId)
  );
  const sponsorshipsSnapshot = await getDocs(sponsorshipsQuery);

  const deletions = sponsorshipsSnapshot.docs.map(docSnap =>
    deleteDoc(doc(db, "sponsorships", docSnap.id))
  );
  await Promise.all(deletions);
}
