import { useState } from "react";
import { BiStar } from "react-icons/bi";
import { BiSolidStar } from "react-icons/bi";
import { db } from "../../db";
import HighlightCardOptions from "./HighlightCardOptions";
import { useHighlightCardEditStore } from "@/store";
import { Quote } from "@/types";

interface HighlightCardProps {
  id: number;
  text: string;
  bookTitle: string;
  bookAuthor: string;
  starred: boolean;
  bookId: number;
}
export default function HighlightCard({
  id,
  text,
  bookTitle,
  bookAuthor,
  starred,
  bookId,
}: HighlightCardProps) {
  const [isStarred, setIsStarred] = useState(starred);
  const { editingQuoteId, setEditingQutoeId } = useHighlightCardEditStore();
  const [editValue, setEditValue] = useState<string>(text);
  let isEditing = editingQuoteId === id;

  async function handleStar() {
    setIsStarred(!isStarred);
    const book = await db.highlights.get(bookId);

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

  function handleEditCancel() {
    setEditingQutoeId(null);
  }

  async function handleEditConfirm() {
    const book = await db.highlights.get(bookId);
    if (!book || !book.quotes) return;

    const targetQuote = book?.quotes.find((quote) => quote.id === id);
    const updatedQuote = { ...targetQuote, text: editValue } as Quote;
    const updatedQuotes = book.quotes.map((quote) =>
      quote.id === id ? updatedQuote : quote
    );
    const result = await db.highlights.update(bookId, {
      quotes: updatedQuotes,
    });
    console.log(result);
    setEditingQutoeId(null);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setEditValue(event.target.value);
  }

  return (
    <div className="flex gap-[12px]  bg-white border-solid border border-black p-4 hover-trigger">
      <div className="w-full">
        <div className="flex items-center justify-between text-neutral-400 mb-2">
          <p className="text-neutral-500">
            {bookTitle} - {bookAuthor}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleStar}
              className="star-icon cursor-pointer"
            >
              {isStarred ? <BiSolidStar size={20} /> : <BiStar size={20} />}
            </button>
            <HighlightCardOptions quoteId={id} bookId={bookId} />
          </div>
        </div>
        {isEditing ? (
          <textarea
            className="resize-none min-h-[12rem] mb-2 w-full border border-black p-2"
            value={editValue}
            onChange={handleEditChange}
          />
        ) : (
          <p>{text}</p>
        )}
        {isEditing && (
          <div className="flex w-full justify-end gap-4">
            <button onClick={handleEditCancel} className="p-2 px-4 ">
              Cancel
            </button>
            <button
              onClick={handleEditConfirm}
              className="p-2 bg-neutral-800 text-white px-4 hover:bg-white hover:text-black border-2 "
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
