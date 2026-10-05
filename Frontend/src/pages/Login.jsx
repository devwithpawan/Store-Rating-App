import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Star,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}
        <section className="login-info">

          <div className="login-info-content">

            <div className="login-small-badge">
              <Star size={14} fill="currentColor" />
              Store Rating Platform
            </div>

            <h1>
              Rate better.
              <br />
              <span>Choose better.</span>
            </h1>

            <p className="login-description">
              Discover trusted stores, share your experience,
              and help businesses understand what their customers
              really think.
            </p>


            <div className="login-features">

              <div className="login-feature">

                <div className="login-feature-icon">
                  <Store size={19} />
                </div>

                <div>
                  <h3>Discover Stores</h3>
                  <p>
                    Find stores using name and address.
                  </p>
                </div>

              </div>


              <div className="login-feature">

                <div className="login-feature-icon">
                  <Star size={19} />
                </div>

                <div>
                  <h3>Share Ratings</h3>
                  <p>
                    Rate your experience from 1 to 5 stars.
                  </p>
                </div>

              </div>


              <div className="login-feature">

                <div className="login-feature-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <h3>Secure Platform</h3>
                  <p>
                    Your account and data stay protected.
                  </p>
                </div>

              </div>

            </div>


            <div className="login-users">

              <div className="login-avatar-stack">
                <span>P</span>
                <span>R</span>
                <span>A</span>
              </div>

              <div>
                <strong>Trusted by users</strong>
                <p>Real experiences. Real ratings.</p>
              </div>

            </div>

          </div>

        </section>


        {/* RIGHT SIDE */}
        <section className="login-form-section">

          <div className="login-form-card">

            <div className="login-form-heading">

              <div className="login-form-icon">
                <Star size={20} fill="currentColor" />
              </div>

              <h2>Welcome back</h2>

              <p>
                Sign in to continue to StoreRate.
              </p>

            </div>


            {/* ERROR */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="login-form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>


              {/* PASSWORD */}
              <div className="login-form-group">

                <div className="login-password-label">

                  <label htmlFor="password">
                    Password
                  </label>

                </div>


                <div className="login-password-input">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="login-password-toggle"
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

              </div>


              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>


            {/* REGISTER */}
            <div className="login-register">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create account
              </Link>

            </div>


            {/* SECURITY */}
            <div className="login-security">

              <ShieldCheck size={15} />

              <span>
                Secure authentication
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
};

export default Login;