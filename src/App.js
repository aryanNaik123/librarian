import React, { useState, useEffect } from "react";
import { IoLibrary } from "react-icons/io5";
import { Typeahead } from "react-typeahead";
import axios from 'axios';

export default function App() {
  const [showSearchBar, setShowSearchBar] = useState(true); // Keep search bar visible by default
  const [searchQuery, setSearchQuery] = useState("");
  const [bookOptions, setBookOptions] = useState([]);
  // Initialize readingList from local storage or as an empty array if not found
  const [readingList, setReadingList] = useState(() => {
    const saved = localStorage.getItem("readingList");
    return saved ? JSON.parse(saved) : [];
  }); 
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    if (searchQuery) {
      const fetchBooks = async () => {
        setIsLoading(true); 
        try {
          const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`);
          const books = response.data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            cover_i: book.cover_i
          }));
          setBookOptions(books);
        } catch (error) {
          console.error("Failed to fetch books:", error);
          setBookOptions([]);
        } finally {
          setIsLoading(false); 
        }
      };

      fetchBooks();
    }
  }, [searchQuery]);

  // Save readingList to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("readingList", JSON.stringify(readingList));
  }, [readingList]);

  const handleAddBookClick = () => {
    setShowSearchBar(!showSearchBar); // Toggle search bar visibility
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleBookSelection = (option) => {
    const selectedBook = bookOptions.find(book => book.title === option);
    if (selectedBook) {
      setReadingList(prevList => [...prevList, selectedBook]);
    }
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
          {showSearchBar ? "Hide Search Bar" : "Add a Book"} 
        </button>
        {showSearchBar && (
          <div className="mt-4">
            {isLoading && <div className="spinner w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin-slow"></div>}
              <Typeahead
                options={bookOptions.map(book => book.title)}
                maxVisible={5}
                onOptionSelected={handleBookSelection} 
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
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Reading List</h2>
          <ul>
            {readingList.map((book, index) => (
              <li key={index} className="flex items-center space-x-3">
                <img 
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                  alt={`Cover of ${book.title}`} 
                  className="w-20 h-30"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Cover'}
                />
                <span>{book.title} by {book.author}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
