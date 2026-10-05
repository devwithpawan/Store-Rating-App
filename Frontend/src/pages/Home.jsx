import { Link } from "react-router-dom";
import {
    ArrowRight,
    Star,
    Search,
    ShieldCheck,
    BarChart3,
    Users,
    Store,
    CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        
            <div className="home-page">

                {/* HERO */}
                <section className="home-hero">
                    <div className="home-container hero-grid">

                        <div className="hero-content">
                            <div className="hero-badge">
                                <Star size={15} fill="currentColor" />
                                Trusted Store Rating Platform
                            </div>

                            <h1>
                                Discover stores.
                                <br />
                                <span>Share your experience.</span>
                            </h1>

                            <p className="hero-description">
                                StoreRate makes it simple to discover stores, check ratings,
                                share your experience, and help businesses understand what
                                their customers really think.
                            </p>

                            <div className="hero-actions">
                                <Link to="/register" className="primary-button">
                                    Get Started
                                    <ArrowRight size={18} />
                                </Link>

                                <Link to="/login" className="secondary-button">
                                    Sign In
                                </Link>
                            </div>

                            <div className="hero-trust">
                                <CheckCircle2 size={17} />
                                <span>Simple, secure and role-based</span>
                            </div>
                        </div>

                        {/* RATING CARD */}
                        <div className="hero-visual">
                            <div className="hero-main-card">

                                <div className="hero-card-top">
                                    <div className="hero-store-icon">
                                        <Store size={24} />
                                    </div>

                                    <div>
                                        <h3>Urban Fitness</h3>
                                        <p>Premium Fitness Center</p>
                                    </div>

                                    <span className="verified-badge">
                                        ✓
                                    </span>
                                </div>

                                <div className="hero-rating">
                                    <strong>4.8</strong>

                                    <div>
                                        <div className="hero-stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={18}
                                                    fill="currentColor"
                                                />
                                            ))}
                                        </div>

                                        <span>124 customer ratings</span>
                                    </div>
                                </div>

                                <div className="hero-divider" />

                                <div className="rating-bars">

                                    <div className="rating-bar-row">
                                        <span>5</span>
                                        <div className="rating-bar">
                                            <div style={{ width: "82%" }} />
                                        </div>
                                        <span>82%</span>
                                    </div>

                                    <div className="rating-bar-row">
                                        <span>4</span>
                                        <div className="rating-bar">
                                            <div style={{ width: "65%" }} />
                                        </div>
                                        <span>65%</span>
                                    </div>

                                    <div className="rating-bar-row">
                                        <span>3</span>
                                        <div className="rating-bar">
                                            <div style={{ width: "32%" }} />
                                        </div>
                                        <span>32%</span>
                                    </div>

                                </div>

                            </div>

                            <div className="floating-rating-card">
                                <div className="floating-icon">
                                    <Star size={17} fill="currentColor" />
                                </div>

                                <div>
                                    <strong>Rate a Store</strong>
                                    <span>1 – 5 stars</span>
                                </div>
                            </div>

                            <div className="floating-users-card">
                                <div className="mini-user-stack">
                                    <span>A</span>
                                    <span>R</span>
                                    <span>P</span>
                                </div>

                                <div>
                                    <strong>Customer feedback</strong>
                                    <span>Real experiences matter</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* STATS */}
                <section className="home-stats">
                    <div className="home-container stats-grid">

                        <div className="stat-item">
                            <Store size={22} />
                            <div>
                                <strong>Stores</strong>
                                <span>Discover and rate</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <Users size={22} />
                            <div>
                                <strong>Users</strong>
                                <span>Share experiences</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <Star size={22} />
                            <div>
                                <strong>1–5 Ratings</strong>
                                <span>Simple rating system</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <ShieldCheck size={22} />
                            <div>
                                <strong>Secure</strong>
                                <span>Protected accounts</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* FEATURES */}
                <section className="home-section" id="features">
                    <div className="home-container">

                        <div className="section-heading-center">
                            <span>WHY STORERATE</span>
                            <h2>Everything you need to manage store ratings</h2>
                            <p>
                                A simple platform designed for customers, store owners,
                                and administrators.
                            </p>
                        </div>

                        <div className="feature-grid">

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <Search size={23} />
                                </div>

                                <h3>Find Stores Easily</h3>

                                <p>
                                    Search stores by name or address and quickly find the
                                    information you need.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <Star size={23} />
                                </div>

                                <h3>Rate & Review</h3>

                                <p>
                                    Give stores a rating from 1 to 5 and update your rating
                                    whenever your experience changes.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <BarChart3 size={23} />
                                </div>

                                <h3>Track Performance</h3>

                                <p>
                                    Store owners can monitor average ratings, total ratings,
                                    and customer feedback.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <ShieldCheck size={23} />
                                </div>

                                <h3>Role-Based Security</h3>

                                <p>
                                    Secure access ensures administrators, users, and owners
                                    only see the features they are authorized to use.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="how-section" id="how-it-works">
                    <div className="home-container">

                        <div className="section-heading-center">
                            <span>HOW IT WORKS</span>
                            <h2>Simple from start to finish</h2>
                            <p>
                                Get started in just a few simple steps.
                            </p>
                        </div>

                        <div className="steps-grid">

                            <div className="step-card">
                                <div className="step-number">01</div>
                                <h3>Create an account</h3>
                                <p>
                                    Sign up as a normal user and create your secure account.
                                </p>
                            </div>

                            <div className="step-card">
                                <div className="step-number">02</div>
                                <h3>Discover a store</h3>
                                <p>
                                    Search for stores using their name or location.
                                </p>
                            </div>

                            <div className="step-card">
                                <div className="step-number">03</div>
                                <h3>Share your rating</h3>
                                <p>
                                    Rate your experience from one to five stars.
                                </p>
                            </div>

                            <div className="step-card">
                                <div className="step-number">04</div>
                                <h3>Track feedback</h3>
                                <p>
                                    Owners and administrators can monitor store performance.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ROLES */}
                <section className="home-section">
                    <div className="home-container">

                        <div className="section-heading-center">
                            <span>BUILT FOR EVERYONE</span>
                            <h2>One platform. Three powerful roles.</h2>
                        </div>

                        <div className="role-grid">

                            <div className="role-card">
                                <div className="role-icon">
                                    <Users size={25} />
                                </div>

                                <h3>Normal Users</h3>

                                <ul>
                                    <li>Discover stores</li>
                                    <li>Search by name and address</li>
                                    <li>Submit ratings</li>
                                    <li>Update your rating</li>
                                </ul>

                                <Link to="/register">
                                    Get Started <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="role-card featured-role">
                                <div className="role-icon">
                                    <Store size={25} />
                                </div>

                                <h3>Store Owners</h3>

                                <ul>
                                    <li>Manage multiple stores</li>
                                    <li>Monitor average ratings</li>
                                    <li>View total ratings</li>
                                    <li>See customer feedback</li>
                                </ul>

                                <Link to="/login">
                                    Owner Login <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="role-card">
                                <div className="role-icon">
                                    <BarChart3 size={25} />
                                </div>

                                <h3>Administrators</h3>

                                <ul>
                                    <li>Manage users</li>
                                    <li>Manage stores</li>
                                    <li>View platform statistics</li>
                                    <li>Filter and sort data</li>
                                </ul>

                                <Link to="/login">
                                    Admin Login <ArrowRight size={16} />
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="home-cta">
                    <div className="home-container">

                        <div className="cta-box">
                            <div>
                                <span>READY TO GET STARTED?</span>

                                <h2>
                                    Make every store experience count.
                                </h2>

                                <p>
                                    Join StoreRate and start discovering, rating,
                                    and understanding stores today.
                                </p>
                            </div>

                            <Link to="/register" className="cta-button">
                                Create Free Account
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                    </div>
                </section>

                {/* FOOTER */}
                <footer className="home-footer">
                    <div className="home-container footer-inner">

                        <Link to="/" className="footer-logo">
                            <span>S</span>
                            StoreRate
                        </Link>

                        <p>
                            © {new Date().getFullYear()} StoreRate. Store rating
                            management platform.
                        </p>

                        <div className="footer-links">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>

                    </div>
                </footer>

            </div>
        
    );
};

export default Home;