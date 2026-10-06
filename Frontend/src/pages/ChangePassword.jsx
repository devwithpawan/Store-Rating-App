import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const ChangePassword = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (form.newPassword !== form.confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        if (form.newPassword.length < 8 || form.newPassword.length > 16) {
            setError("Password must be between 8 and 16 characters");
            return;
        }

        try {
            setLoading(true);

            await api.put("/auth/change-password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            setMessage("Password changed successfully");

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.role === "ADMIN") {
            navigate("/admin/dashboard");
        } else if (user?.role === "OWNER") {
            navigate("/owner/dashboard");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <>
            <Navbar />

            <main className="change-password-page">

                <div className="change-password-card">

                    <button
                        className="back-button"
                        onClick={handleBack}
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <div className="password-icon">
                        <Lock size={22} />
                    </div>

                    <h1>Change Password</h1>

                    <p className="password-subtitle">
                        Update your account password securely.
                    </p>

                    {error && (
                        <div className="password-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="password-success">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="password-field">
                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                required
                            />
                        </div>

                        <div className="password-field">
                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div className="password-field">
                            <label>
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <p className="password-hint">
                            Password must be 8–16 characters.
                        </p>

                        <button
                            type="submit"
                            className="change-password-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : "Update Password"}
                        </button>

                    </form>

                </div>

            </main>
        </>
    );
};

export default ChangePassword;