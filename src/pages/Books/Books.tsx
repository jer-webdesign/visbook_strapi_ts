import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import "../../components/Modal/Modal.css";
import { useNavigate } from "react-router-dom";
import "./Books.css"; // optional styling
import { useAuth } from "../../context/AuthContext";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../../firebase";
import { Book } from "../../types";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBook, setModalBook] = useState<Book | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const db = getFirestore(app);

  // const STRAPI_URL = "http://localhost:1337"; // Replace with live URL if needed
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const STRAPI_MEDIA_URL = import.meta.env.VITE_STRAPI_MEDIA_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${STRAPI_URL}/api/books?populate=*&pagination[limit]=30`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Books API Response:", data);
        setBooks(data.data || []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookID: number | string) => {
    navigate(`/books/${bookID}`);
  };

  const handleAddToCart = async (book: Book) => {
    let cartKey = "cart";
    let isUser = currentUser && currentUser.uid;
    if (isUser && currentUser) {
      cartKey = `cart_${currentUser.uid}`;
    }
    let existingCart: Book[] = JSON.parse(localStorage.getItem(cartKey) || '[]') || [];
    const itemIndex = existingCart.findIndex(item => item.id === book.id);
    if (itemIndex === -1) {
      // Not in cart, add with quantity 1
      existingCart.push({ ...book, quantity: 1 });
    } else {
      // Already in cart, increment quantity
      existingCart[itemIndex].quantity = (existingCart[itemIndex].quantity || 1) + 1;
    }
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    if (isUser && currentUser) {
      try {
        await setDoc(doc(db, "carts", currentUser.uid), { items: existingCart });
      } catch (e) {
        // Optionally handle Firestore error
      }
    }
    window.dispatchEvent(new Event('cartUpdated'));
    setModalBook(book);
    setModalOpen(true);
  };

  // If loading, show a spinner and message
  if (loading) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '71.55vh' }}>
        <div className="spinner" style={{ marginBottom: '1.2rem' }}></div>
        <div style={{ color: '#46d0ef', fontSize: '1.12rem', fontWeight: 500, letterSpacing: '0.01em', textAlign: 'center' }}>
          Please wait, loading books…
        </div>
      </main>
    );
  }

  if (error) {
    return <main style={{ padding: "2rem" }}><p>Error loading books: {error}</p></main>;
  }

  return (
    <>
      <main style={{ padding: "2rem" }}>
        <h2>All Books</h2>
        <div className="books-container">
          {books.map((book) => {
            if (!book) return null;
            const cover = book.filename
              ? `${STRAPI_MEDIA_URL}/${book.filename}`
              : null;
            return (
              <div key={book.id} className="book-card">
                {cover ? (
                  <img
                    src={cover}
                    alt={book.title || "Book cover"}
                    onClick={() => handleBookClick(book.id)}
                    style={{
                      width: 200,
                      height: 300,
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onError={(e) => {
                      console.warn("Image failed to load:", cover);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 200,
                      height: 300,
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => handleBookClick(book.id)}
                  >
                    No Cover
                  </div>
                )}
                <h4>{book.title || "Unknown Title"}</h4>
                <p><em>{book.author || "Unknown Author"}</em></p>
                <p>${book.price_cad?.toFixed(2) || "0.00"} CAD</p>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(book)}>
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalBook ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a3a4a', fontWeight: 600, fontSize: '1.08rem' }}>
                <span style={{ color: '#46d0ef', fontSize: 22, fontWeight: 700, marginRight: 4 }}>&#10003;</span>
                Item added to your cart
              </div>
              <span style={{ width: 32 }}></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, width: '100%', marginBottom: 10 }}>
              {modalBook.filename && (
                <img src={`${STRAPI_MEDIA_URL}/${modalBook.filename}`} alt={modalBook.title} style={{ width: 90, height: 120, objectFit: 'cover', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
              )}
              <div style={{ fontWeight: 700, fontSize: '1.08rem', textAlign: 'left', maxWidth: 200 }}>{modalBook.title}</div>
            </div>
            <hr style={{ width: '100%', border: 0, borderTop: '1px solid #e0e7ef', margin: '1.1rem 0 0.7rem 0' }} />
            <button
              className="modal-view-cart-btn"
              onClick={() => { setModalOpen(false); navigate('/cart'); }}
            >
              View cart
            </button>
            <button
              className="modal-continue-shopping-btn"
              onClick={() => { setModalOpen(false); navigate('/books'); }}
            >
              Continue shopping
            </button>
          </div>
        ) : null}
      </Modal>
    </>
  );
}