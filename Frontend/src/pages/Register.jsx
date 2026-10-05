import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Star,
  ShieldCheck,
  Store,
  Users,
  CheckCircle2,
} from "lucide-react";

import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();
    const password = formData.password;

    // Name: 20–60 characters
    if (name.length < 20 || name.length > 60) {
      return "Name must be between 20 and 60 characters.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // Address: maximum 400 characters
    if (address.length > 400) {
      return "Address must not exceed 400 characters.";
    }

    // Password: 8–16 chars, uppercase + special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return "Password must be 8–16 characters and contain at least one uppercase letter and one special character.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        password: formData.password,
      });

      setSuccess("Registration successful. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-container">

        {/* LEFT SECTION */}
        <section className="register-info">

          <div className="register-brand">
            <span className="register-brand-icon">
              <Star size={18} fill="currentColor" />
            </span>
            <span>StoreRate</span>
          </div>

          <div className="register-info-content">

            <span className="register-small-badge">
              <CheckCircle2 size={15} />
              Free to get started
            </span>

            <h1>
              Create your account
              <span> and start rating.</span>
            </h1>

            <p>
              Join StoreRate and discover stores, share your
              experiences, and help others make better decisions.
            </p>

            <div className="register-features">

              <div className="register-feature">
                <div className="register-feature-icon">
                  <Store size={19} />
                </div>

                <div>
                  <h3>Discover Stores</h3>
                  <p>
                    Find stores and explore what other customers think.
                  </p>
                </div>
              </div>

              <div className="register-feature">
                <div className="register-feature-icon">
                  <Star size={19} />
                </div>

                <div>
                  <h3>Share Your Rating</h3>
                  <p>
                    Rate stores from 1 to 5 and share your experience.
                  </p>
                </div>
              </div>

              <div className="register-feature">
                <div className="register-feature-icon">
                  <Users size={19} />
                </div>

                <div>
                  <h3>Help the Community</h3>
                  <p>
                    Your feedback helps other users make better choices.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="register-info-footer">
            <ShieldCheck size={17} />
            <span>Your account information is kept secure.</span>
          </div>

        </section>

        {/* RIGHT SECTION */}
        <section className="register-form-section">

          <div className="register-form-card">

            <div className="register-form-header">
              <h2>Create account</h2>

              <p>
                Fill in your details to create your StoreRate account.
              </p>
            </div>

            {error && (
              <div className="register-message register-error">
                {error}
              </div>
            )}

            {success && (
              <div className="register-message register-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="register-form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={60}
                  required
                />

                <span className="register-helper">
                  20–60 characters
                </span>
              </div>

              {/* EMAIL */}
              <div className="register-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ADDRESS */}
              <div className="register-form-group">
                <div className="register-label-row">
                  <label htmlFor="address">
                    Address
                  </label>

                  <span>
                    {formData.address.length}/400
                  </span>
                </div>

                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  maxLength={400}
                  rows={3}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="register-form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="register-password-input">

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={16}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <span className="register-helper">
                  8–16 characters, one uppercase letter and one special
                  character
                </span>

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="register-submit-button"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

            </form>

            <div className="register-divider">
              <span>Already registered?</span>
            </div>

            <div className="register-login">
              <Link to="/login">
                Sign in to your account
              </Link>
            </div>

            <div className="register-security">
              <ShieldCheck size={16} />
              <span>
                Your information is protected and never shared.
              </span>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
};

export default Register;