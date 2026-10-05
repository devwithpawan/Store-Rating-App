
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  User,
  Shield,
  Store,
  Star,
  Users,
} from "lucide-react";

import api from "../services/api";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserDetails = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/admin/users/${id}`
      );

      setUser(response.data);
    } catch (error) {
      console.error(
        "USER DETAILS ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to load user details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  if (loading) {
    return (
      

        <main className="page">
          <div className="page-container">
            <div className="loading">
              Loading user details...
            </div>
          </div>
        </main>
    );
  }

  if (!user) {
    return (
        <main className="page">
          <div className="page-container">

            <div className="empty-state">
              <h2>User not found</h2>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                Back to Dashboard
              </button>
            </div>

          </div>
        </main>
      
    );
  }

  return (
   

      <main className="page">
        <div className="page-container">

          {/* ================= HEADER ================= */}

          <div className="page-header">

            <div>

              <button
                className="back-button"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </button>

              <p className="eyebrow">
                USER DETAILS
              </p>

              <h1>{user.name}</h1>

              <p className="page-description">
                View account information and store
                details.
              </p>

            </div>

          </div>

          {/* ================= USER PROFILE ================= */}

          <section className="details-grid">

            {/* BASIC INFORMATION */}

            <div className="details-card">

              <div className="details-card-header">

                <div className="details-icon">
                  <User size={20} />
                </div>

                <div>
                  <h2>Basic Information</h2>
                  <p>
                    Account information
                  </p>
                </div>

              </div>

              <div className="details-list">

                <div className="detail-row">
                  <span>
                    <User size={16} />
                    Name
                  </span>

                  <strong>
                    {user.name}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>
                    <Mail size={16} />
                    Email
                  </span>

                  <strong>
                    {user.email}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>
                    <MapPin size={16} />
                    Address
                  </span>

                  <strong>
                    {user.address || "Not provided"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>
                    <Shield size={16} />
                    Role
                  </span>

                  <span
                    className={`role-badge role-${user.role.toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </div>

              </div>

            </div>

            {/* ACCOUNT SUMMARY */}

            <div className="details-card">

              <div className="details-card-header">

                <div className="details-icon">
                  <Shield size={20} />
                </div>

                <div>
                  <h2>Account</h2>
                  <p>
                    Account summary
                  </p>
                </div>

              </div>

              <div className="summary-box">

                <div>
                  <span>Account ID</span>
                  <strong>#{user.id}</strong>
                </div>

                <div>
                  <span>Role</span>
                  <strong>{user.role}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong className="status-active">
                    Active
                  </strong>
                </div>

              </div>

            </div>

          </section>

          {/* ================= OWNER STORE ================= */}

          {user.role === "OWNER" && (
            <section className="section">

              <div className="section-header">

                <div>
                  <h2>Store Information</h2>

                  <p>
                    Store and rating information
                    for this owner.
                  </p>
                </div>

              </div>

              {user.store ? (
                <div className="owner-store-card">

                  <div className="owner-store-header">

                    <div className="store-title">

                      <div className="details-icon">
                        <Store size={20} />
                      </div>

                      <div>
                        <h2>
                          {user.store.name}
                        </h2>

                        <p>
                          {user.store.email}
                        </p>
                      </div>

                    </div>

                    <span className="role-badge role-owner">
                      STORE OWNER
                    </span>

                  </div>

                  <div className="owner-store-details">

                    <div className="store-info">

                      <span>
                        <Mail size={16} />
                        Email
                      </span>

                      <strong>
                        {user.store.email}
                      </strong>

                    </div>

                    <div className="store-info">

                      <span>
                        <MapPin size={16} />
                        Address
                      </span>

                      <strong>
                        {user.store.address ||
                          "Not provided"}
                      </strong>

                    </div>

                    <div className="store-info">

                      <span>
                        <Star size={16} />
                        Average Rating
                      </span>

                      <strong className="large-rating">
                        <Star
                          size={18}
                          fill="currentColor"
                        />

                        {Number(
                          user.store.average_rating ||
                          0
                        ).toFixed(1)}
                        / 5
                      </strong>

                    </div>

                    <div className="store-info">

                      <span>
                        <Users size={16} />
                        Total Ratings
                      </span>

                      <strong>
                        {user.store.total_ratings ||
                          0}
                      </strong>

                    </div>

                  </div>

                </div>
              ) : (
                <div className="empty-state">
                  <Store size={28} />

                  <h3>
                    No store assigned
                  </h3>

                  <p>
                    This store owner does not
                    have a store yet.
                  </p>
                </div>
              )}

            </section>
          )}

        </div>
      </main>
  );
};

export default AdminUserDetails;