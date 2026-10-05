
import { useEffect, useState } from "react";
import {
    Search,
    Star,
    MapPin,
    Store,
    Send,
    Edit3,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        name: "",
        address: "",
    });

    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);

    const [submitting, setSubmitting] = useState(false);

    // =========================
    // LOAD STORES
    // =========================

    const loadStores = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (filters.name) {
                params.append("name", filters.name);
            }

            if (filters.address) {
                params.append("address", filters.address);
            }

            const response = await api.get(
                `/stores?${params.toString()}`
            );

            setStores(response.data);
        } catch (error) {
            console.error(
                "GET STORES ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                    "Failed to load stores"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    // =========================
    // SEARCH
    // =========================

    const handleSearch = () => {
        loadStores();
    };

    const handleClearSearch = () => {
        setFilters({
            name: "",
            address: "",
        });

        setTimeout(() => {
            loadStores();
        }, 0);
    };

    // =========================
    // SELECT RATING
    // =========================

    const openRatingModal = (store) => {
        setSelectedStore(store);

        setSelectedRating(
            store.my_rating
                ? Number(store.my_rating)
                : 0
        );
    };

    const closeRatingModal = () => {
        setSelectedStore(null);
        setSelectedRating(0);
    };

    // =========================
    // SUBMIT / UPDATE RATING
    // =========================

    const handleRatingSubmit = async () => {
        if (!selectedStore) return;

        if (
            !selectedRating ||
            selectedRating < 1 ||
            selectedRating > 5
        ) {
            alert("Please select a rating between 1 and 5");
            return;
        }

        try {
            setSubmitting(true);

            const existingRating =
                selectedStore.my_rating !== null &&
                selectedStore.my_rating !== undefined;

            if (existingRating) {
                await api.put(
                    `/ratings/${selectedStore.id}`,
                    {
                        rating: selectedRating,
                    }
                );
            } else {
                await api.post("/ratings", {
                    storeId: selectedStore.id,
                    rating: selectedRating,
                });
            }

            alert(
                existingRating
                    ? "Rating updated successfully"
                    : "Rating submitted successfully"
            );

            closeRatingModal();

            await loadStores();
        } catch (error) {
            console.error(
                "RATING ERROR:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                    "Failed to submit rating"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="page">
                    <div className="page-container">
                        <div className="loading">
                            Loading stores...
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <main className="page">
                <div className="page-container">

                    {/*  HEADER  */}

                    <div className="page-header user-page-header">

                        <div>
                            <p className="eyebrow">
                                STORE RATING
                            </p>

                            <h1>Find a Store</h1>

                            <p className="page-description">
                                Discover stores and share your
                                experience.
                            </p>
                        </div>

                    </div>

                    {/* SEARCH */}

                    <section className="store-search-card">

                        <div className="search-field">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search store name..."
                                value={filters.name}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        name: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />

                        </div>

                        <div className="search-field">

                            <MapPin size={18} />

                            <input
                                type="text"
                                placeholder="Search address..."
                                value={filters.address}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        address: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />

                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleSearch}
                        >
                            <Search size={16} />
                            Search
                        </button>

                        {(filters.name ||
                            filters.address) && (
                            <button
                                className="btn btn-secondary"
                                onClick={handleClearSearch}
                            >
                                Clear
                            </button>
                        )}

                    </section>

                    {/* ================= STORE COUNT ================= */}

                    <div className="store-result-header">
                        <div>
                            <h2>Stores</h2>

                            <p>
                                {stores.length}{" "}
                                {stores.length === 1
                                    ? "store"
                                    : "stores"}{" "}
                                found
                            </p>
                        </div>
                    </div>

                    {/* ================= STORES ================= */}

                    {stores.length > 0 ? (
                        <section className="store-grid">

                            {stores.map((store) => {

                                const hasRated =
                                    store.my_rating !== null &&
                                    store.my_rating !== undefined;

                                return (
                                    <article
                                        className="store-card"
                                        key={store.id}
                                    >

                                        {/* Store icon */}

                                        <div className="store-card-top">

                                            <div className="store-icon">
                                                <Store size={21} />
                                            </div>

                                            <div className="store-rating">

                                                <Star
                                                    size={16}
                                                    fill="currentColor"
                                                />

                                                <strong>
                                                    {Number(
                                                        store.average_rating ||
                                                            0
                                                    ).toFixed(1)}
                                                </strong>

                                                <span>
                                                    / 5
                                                </span>

                                            </div>

                                        </div>

                                        {/* Store details */}

                                        <div className="store-card-content">

                                            <h3>
                                                {store.name}
                                            </h3>

                                            <div className="store-address">

                                                <MapPin
                                                    size={15}
                                                />

                                                <span>
                                                    {store.address ||
                                                        "Address not available"}
                                                </span>

                                            </div>

                                        </div>

                                        {/* User rating */}

                                        <div className="my-rating-box">

                                            <div>
                                                <span>
                                                    Your rating
                                                </span>

                                                <strong>
                                                    {hasRated
                                                        ? `⭐ ${store.my_rating} / 5`
                                                        : "Not rated yet"}
                                                </strong>
                                            </div>

                                            {hasRated && (
                                                <span className="rated-badge">
                                                    Rated
                                                </span>
                                            )}

                                        </div>

                                        {/* Action */}

                                        <button
                                            className={
                                                hasRated
                                                    ? "rating-action rating-action-edit"
                                                    : "rating-action"
                                            }
                                            onClick={() =>
                                                openRatingModal(
                                                    store
                                                )
                                            }
                                        >

                                            {hasRated ? (
                                                <>
                                                    <Edit3
                                                        size={16}
                                                    />
                                                    Edit Rating
                                                </>
                                            ) : (
                                                <>
                                                    <Star
                                                        size={16}
                                                    />
                                                    Rate Store
                                                </>
                                            )}

                                        </button>

                                    </article>
                                );
                            })}

                        </section>
                    ) : (
                        <div className="empty-state store-empty">

                            <Store size={30} />

                            <h3>
                                No stores found
                            </h3>

                            <p>
                                Try changing your search
                                criteria.
                            </p>

                        </div>
                    )}

                </div>
            </main>

            {/* ================= RATING MODAL ================= */}

            {selectedStore && (
                <div
                    className="modal-overlay"
                    onClick={closeRatingModal}
                >

                    <div
                        className="rating-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="rating-modal-header">

                            <div>
                                <p className="eyebrow">
                                    {selectedStore.my_rating
                                        ? "UPDATE RATING"
                                        : "RATE STORE"}
                                </p>

                                <h2>
                                    {selectedStore.name}
                                </h2>

                                <p>
                                    How would you rate this
                                    store?
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closeRatingModal}
                            >
                                ×
                            </button>

                        </div>

                        {/* Stars */}

                        <div className="rating-selector">

                            {[1, 2, 3, 4, 5].map(
                                (rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        className={
                                            rating <=
                                            selectedRating
                                                ? "rating-star active"
                                                : "rating-star"
                                        }
                                        onClick={() =>
                                            setSelectedRating(
                                                rating
                                            )
                                        }
                                    >
                                        <Star
                                            size={34}
                                            fill={
                                                rating <=
                                                selectedRating
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                )
                            )}

                        </div>

                        <div className="rating-number">

                            {selectedRating > 0
                                ? `${selectedRating} / 5`
                                : "Select a rating"}

                        </div>

                        {/* Actions */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeRatingModal}
                                disabled={submitting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleRatingSubmit}
                                disabled={
                                    submitting ||
                                    selectedRating === 0
                                }
                            >
                                <Send size={16} />

                                {submitting
                                    ? "Saving..."
                                    : selectedStore.my_rating
                                    ? "Update Rating"
                                    : "Submit Rating"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
};

export default UserDashboard;