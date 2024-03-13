import React, { useState, useEffect } from "react";
import { IoLibrary } from "react-icons/io5";
import { Typeahead } from "react-typeahead";
import axios from 'axios';

export default function App() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookOptions, setBookOptions] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const fetchBooks = async () => {
        try {
          const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`);
          const books = response.data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            cover_i: book.cover_i
          }));
          setBookOptions(books); // Adjusted to map and set the processed books
        } catch (error) {
          console.error("Failed to fetch books:", error);
          setBookOptions([]);
        }
      };

      fetchBooks();
    }
  }, [searchQuery]);

  const handleAddBookClick = () => {
    setShowSearchBar(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-6">
        Librarian <IoLibrary className="inline-block mb-1" />
      </h1>
      <div className="ml-5">
        <button
          onClick={handleAddBookClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add a Book
        </button>
        {showSearchBar && (
          <div className="mt-4">
            <Typeahead
              options={bookOptions.map(book => book.title)} // Map book objects to titles
              maxVisible={5}
              onOptionSelected={(option) => console.log("Selected:", option)}
              customClasses={{
                input: "border border-gray-300 rounded px-4 py-2",
                results: "bg-white border border-gray-300 rounded mt-1",
                listItem: "px-4 py-2 cursor-pointer",
              }}
              placeholder="Search for a book..."
              onKeyUp={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
