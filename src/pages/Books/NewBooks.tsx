import { useRef, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./NewBooks.css";
import Modal from "../../components/Modal/Modal";
import "../../components/Modal/Modal.css";
import { Book } from "../../types";

export default function NewBooks() {
  const { currentUser } = useAuth();
  const newBooksRef = useRef(null);
  const bestSellersRef = useRef(null);
  const navigate = useNavigate();
  const scrollByAmount = 236;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBook, setModalBook] = useState<Book | null>(null);

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const STRAPI_MEDIA_URL = import.meta.env.VITE_STRAPI_MEDIA_URL;
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);  
        //const res = await fetch(`${STRAPI_URL}/api/books?populate=*`);     
        const res = await fetch(`${STRAPI_URL}/api/books?pagination[limit]=100`); 
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        console.log("Fetched data:", data);
        if (data && data.data && Array.isArray(data.data)) {
          setBooks(data.data);
        } else {
          setError("Unexpected data structure from API");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [STRAPI_URL]);

  const handleBookClick = (bookID: number | string) => {
    navigate(`/books/${bookID}`);
  };

  const handleAddToCart = (book: Book) => {
    let cartKey = "cart";
    if (currentUser && currentUser.uid) {
      cartKey = `cart_${currentUser.uid}`;
    }
    const existingCart: Book[] = JSON.parse(localStorage.getItem(cartKey) || '[]') || [];
    const itemIndex = existingCart.findIndex(item => item.id === book.id);
    if (itemIndex === -1) {
      existingCart.push({ ...book, quantity: 1 });
    } else {
      existingCart[itemIndex].quantity = (existingCart[itemIndex].quantity || 1) + 1;
    }
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setModalBook(book);
    setModalOpen(true);
  };

  // Initialize carousel to start at the first duplicate set
  const initializeCarousel = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;
    // Temporarily disable smooth scrolling for initialization
    const container = ref.current;
    const originalBehavior = container.style.scrollBehavior;
    container.style.scrollBehavior = "auto";
    
    // Start at the beginning of the second set (first duplicate)
    container.scrollLeft = originalLength * scrollByAmount;
    
    // Restore original scroll behavior
    container.style.scrollBehavior = originalBehavior;
  };

  // True infinite scroll with seamless looping
  const handleInfiniteScroll = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;

    const container = ref.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = scrollByAmount;
    const singleSetWidth = originalLength * itemWidth;

    // If we've scrolled past the end of the second set, reset to the beginning of the second set
    if (scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft = singleSetWidth;
    }
    // If we've scrolled before the beginning of the second set, reset to the end of the second set
    else if (scrollLeft < singleSetWidth) {
      container.scrollLeft = singleSetWidth * 2 - itemWidth;
    }
  };

  const scrollLeft = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;
    
    // Disable smooth scrolling temporarily for the repositioning
    const container = ref.current;
    const originalBehavior = container.style.scrollBehavior;
    
    // Perform the scroll
    container.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
    
    // Check for infinite scroll after animation
    setTimeout(() => {
      container.style.scrollBehavior = "auto";
      handleInfiniteScroll(ref, originalLength);
      container.style.scrollBehavior = originalBehavior;
    }, 300);
  };

  const scrollRight = (ref, originalLength) => {
    if (!ref.current || originalLength === 0) return;
    
    // Disable smooth scrolling temporarily for the repositioning
    const container = ref.current;
    const originalBehavior = container.style.scrollBehavior;
    
    // Perform the scroll
    container.scrollBy({ left: scrollByAmount, behavior: "smooth" });
    
    // Check for infinite scroll after animation
    setTimeout(() => {
      container.style.scrollBehavior = "auto";
      handleInfiniteScroll(ref, originalLength);
      container.style.scrollBehavior = originalBehavior;
    }, 300);
  };

  // Filtering books at root level
  const newReleases = books.filter((book) => book && book.isNewRelease);
  const bestSellers = books.filter((book) => book && book.isBestSeller);

  // Initialize carousels when data is ready
  useEffect(() => {
    if (newReleases.length > 0) {
      // Initialize immediately without delay
      initializeCarousel(newBooksRef, newReleases.length);
    }
    if (bestSellers.length > 0) {
      // Initialize immediately without delay
      initializeCarousel(bestSellersRef, bestSellers.length);
    }
  }, [newReleases.length, bestSellers.length]);

  // Create triple array for true infinite scrolling
  const createInfiniteArray = (bookList) => {
    if (bookList.length === 0) return [];
    return [...bookList, ...bookList, ...bookList];
  };

  const renderBookItem = (book, index, originalId) => {
    if (!book) {
      console.warn("Invalid book data:", book);
      return null;
    }

    const cover = book.filename       
      ? `${STRAPI_MEDIA_URL}/${book.filename}`
      : null;

    return (
      <article key={`${originalId}-${index}`} className="book">
        <figure
          onClick={() => handleBookClick(originalId)}
          style={{ cursor: "pointer" }}
        >
          {cover ? (
            <img
              src={cover}
              alt={`Cover of ${book.title}`}
              width={200}
              height="auto"
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
            >
              No Image
            </div>
          )}
          <figcaption>
            <h4>{book.title}</h4>
            <p>
              <em>{book.author}</em>
            </p>
            <p>${book.price_cad?.toFixed(2)} CAD</p>
          </figcaption>
        </figure>
        <button
          className="add-to-cart-btn"
          onClick={() => handleAddToCart(book)}
        >
          Add to Cart
        </button>
      </article>
    );
  };

  const renderBookCarousel = (bookList, ref, showArrows = true) => {
    if (bookList.length === 0) return null;
    
    const infiniteBooks = createInfiniteArray(bookList);

    return (
      <section className="book-list">
        {showArrows && (
          <button
            className="scroll-arrow left-arrow"
            onClick={() => scrollLeft(ref, bookList.length)}
            aria-label="Scroll left"
          >
            &#9664;
          </button>
        )}

        <section
          className="book-carousel"
          ref={ref}
          style={{ 
            overflowX: "auto", 
            display: "flex", 
            scrollBehavior: "auto", // Start with auto to prevent initial smooth scrolling
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
          onLoad={() => {
            // Enable smooth behavior after initial load
            if (ref.current) {
              ref.current.style.scrollBehavior = "smooth";
            }
          }}
        >
          {infiniteBooks.map((book, index) => {
            // const originalIndex = index % bookList.length;
            return renderBookItem(book, index, book.id);
          })}
        </section>

        {showArrows && (
          <button
            className="scroll-arrow right-arrow"
            onClick={() => scrollRight(ref, bookList.length)}
            aria-label="Scroll right"
          >
            &#9654;
          </button>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '42vh' }}>
        <div className="spinner" style={{ marginBottom: '0rem' }}></div>
        <div style={{ color: '#46d0ef', fontSize: '1.12rem', fontWeight: 500, letterSpacing: '0.01em', textAlign: 'center' }}>
          Please wait, loading books...
         </div> 
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>Error loading books: {error}</p>
      </main>
    );
  }

  return (
    <>
      <main>
        <h2>New Releases</h2>
        {newReleases.length > 0 ? (
          renderBookCarousel(newReleases, newBooksRef, true)
        ) : null}        
        {/* ) : (
          <p>No new releases available.</p>
        )} */}

        <h2>Best Sellers</h2>
        {bestSellers.length > 0 ? (
          renderBookCarousel(bestSellers, bestSellersRef, true)
        ) : null}        
        {/* ) : (
          <p>No best sellers available.</p>
        )} */}
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
