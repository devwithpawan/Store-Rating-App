import { useEffect, useState } from "react";

import {
  Store,
  Star,
  Users,
  MapPin,
  Mail,
  User,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD OWNER DASHBOARD
  const loadDashboard = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await api.get(
        "/owner/dashboard"
      );

      console.log(
        "OWNER DASHBOARD RESPONSE:",
        response.data
      );

      setDashboard(response.data);

    } catch (error) {

      console.error(
        "OWNER DASHBOARD ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load owner dashboard"
      );

    } finally {

      setLoading(false);

    }
  };

  // LOAD DATA

  useEffect(() => {

    loadDashboard();

  }, []);

  // LOADING

  if (loading) {

    return (

      <>
        <Navbar />
        <main className="owner-page">

          <div className="owner-loading">

            Loading dashboard...

          </div>

        </main>
      </>
    );

  }


  // ERROR

  if (error) {
    return (

      <>
        <Navbar />
        <main className="owner-page">

          <div className="owner-error">

            <h3>
              Unable to load dashboard
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={loadDashboard}
            >
              Try Again
            </button>

          </div>

        </main>
      </>
    );

  }
  // GET DATA
  const {
    stores = [],
    totalStores = 0,
    averageRating = 0,
    totalRatings = 0,
    ratings = [],
  } = dashboard || {};
  // UI
  return (
      <main className="owner-page">
        <section className="owner-header">

          <div>

            <p className="owner-eyebrow">
              STORE OWNER
            </p>

            <h1>
              Owner Dashboard
            </h1>

            <p>
              Monitor your stores, ratings and
              customer feedback.
            </p>

          </div>

        </section>

        <section className="owner-stats">
          {/* TOTAL STORES */}
          <div className="owner-stat-card">
            <div className="owner-stat-icon">
              <Store size={20} />
            </div>
            <div>
              <p>
                Total Stores
              </p>
              <h2>
                {totalStores}
              </h2>
            </div>
          </div>
          {/* AVERAGE RATING */}
          <div className="owner-stat-card">
            <div className="owner-stat-icon">
              <Star size={20} />
            </div>
            <div>
              <p>
                Average Rating
              </p>
              <h2>
                {Number(
                  averageRating
                ).toFixed(1)}
                <span>
                  /5
                </span>
              </h2>
            </div>
          </div>

          {/* TOTAL RATINGS */}

          <div className="owner-stat-card">

            <div className="owner-stat-icon">

              <Users size={20} />

            </div>

            <div>

              <p>
                Total Ratings
              </p>

              <h2>
                {totalRatings}
              </h2>

            </div>

          </div>

        </section>

        {/*MY STORES*/}

        <section className="owner-ratings-section">

          <div className="owner-section-header">

            <div>

              <h2>
                My Stores
              </h2>

              <p>
                Overview of all stores owned by you.
              </p>

            </div>

            <div className="rating-count">

              {totalStores} stores

            </div>

          </div>

          {stores.length === 0 ? (

            <div className="owner-empty">

              <Store size={30} />

              <h3>
                No stores found
              </h3>

              <p>
                No stores are currently assigned
                to you.
              </p>

            </div>

          ) : (

            <div className="owner-store-grid">

              {stores.map((store) => (

                <div
                  className="owner-store-card"
                  key={store.id}
                >


                  {/* STORE ICON */}

                  <div className="owner-store-icon">

                    <Store size={22} />

                  </div>



                  {/* STORE INFORMATION */}

                  <div className="owner-store-info">

                    <h2>
                      {store.name}
                    </h2>


                    <div className="owner-store-meta">

                      <span>

                        <Mail size={15} />

                        {store.email}

                      </span>


                      <span>

                        <MapPin size={15} />

                        {store.address}

                      </span>

                    </div>

                  </div>



                  {/* STORE RATING */}

                  <div className="owner-store-rating">

                    <div className="customer-rating">

                      <Star
                        size={17}
                        fill="currentColor"
                      />

                      <strong>

                        {Number(
                          store.averageRating || 0
                        ).toFixed(1)}

                      </strong>

                      <span>
                        /5
                      </span>

                    </div>


                    <p>

                      {store.totalRatings || 0}

                      {" "}

                      ratings

                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/*  CUSTOMER RATINGS*/}

        <section className="owner-ratings-section">


          <div className="owner-section-header">

            <div>

              <h2>
                Customer Ratings
              </h2>

              <p>
                Users who submitted ratings
                for your stores.
              </p>

            </div>


            <div className="rating-count">

              {totalRatings} ratings

            </div>

          </div>



          {ratings.length === 0 ? (

            <div className="owner-empty">

              <Star size={30} />

              <h3>
                No ratings yet
              </h3>

              <p>
                Customer ratings will appear here.
              </p>

            </div>

          ) : (

            <div className="owner-table-wrapper">

              <table className="owner-table">

                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Store
                    </th>

                    <th>
                      Rating
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {ratings.map((rating) => (

                    <tr
                      key={rating.id}
                    >
                      {/* USER */}

                      <td>

                        <div className="owner-user">

                          <div className="owner-user-icon">

                            <User size={16} />

                          </div>

                          <span>

                            {rating.name}

                          </span>

                        </div>

                      </td>
                      {/* EMAIL */}

                      <td>

                        {rating.email}

                      </td>



                      {/* STORE */}

                      <td>

                        {rating.store_name}

                      </td>



                      {/* RATING */}

                      <td>

                        <div className="customer-rating">

                          <Star
                            size={16}
                            fill="currentColor"
                          />

                          <strong>

                            {rating.rating}

                          </strong>

                          <span>
                            /5
                          </span>

                        </div>

                      </td>



                      {/* DATE */}

                      <td>

                        {new Date(
                          rating.created_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>
  );

};

export default OwnerDashboard;


