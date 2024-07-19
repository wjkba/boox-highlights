import { useState } from "react";
import { BiStar } from "react-icons/bi";
import { BiSolidStar } from "react-icons/bi";
import { db } from "../../db";

interface HighlightCardProps {
  id: number;
  text: string;
  bookTitle: string;
  bookAuthor: string;
  starred: boolean;
}
export default function HighlightCard({
  id,
  text,
  bookTitle,
  bookAuthor,
  starred,
}: HighlightCardProps) {
  const [isStarred, setIsStarred] = useState(starred);

  async function handleStar() {
    setIsStarred(!isStarred);
    const book = await db.highlights.where({ bookTitle }).first();
    if (book) {
      const updatedQuotes = book.quotes.map((quote) => {
        if (quote.id === id) {
          return { ...quote, starred: !isStarred };
        }
        return quote;
      });
      const updatedBook = { ...book, quotes: updatedQuotes };
      await db.highlights.put(updatedBook);
    }
  }

  return (
    <div className="bg-white border-solid border border-black p-4 hover-trigger">
      <div className="flex items-center justify-between text-neutral-400 mb-2">
        <p className="text-neutral-500">
          {bookTitle} - {bookAuthor}
        </p>
        <button
          type="button"
          onClick={handleStar}
          className="star-icon cursor-pointer"
        >
          {isStarred ? <BiSolidStar size={20} /> : <BiStar size={20} />}
        </button>
      </div>
      <p>{text}</p>
    </div>
  );
}