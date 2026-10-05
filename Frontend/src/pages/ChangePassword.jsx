// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import api from "../services/api";

// const ChangePassword = () => {

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);


//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };


//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     setError("");
//     setSuccess("");


//     // Check new password
//     if (
//       formData.newPassword !==
//       formData.confirmPassword
//     ) {
//       setError(
//         "New passwords do not match."
//       );

//       return;
//     }


//     // Password validation
//     const passwordRegex =
//       /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

//     if (
//       !passwordRegex.test(
//         formData.newPassword
//       )
//     ) {
//       setError(
//         "Password must be 8-16 characters and contain at least one uppercase letter and one special character."
//       );

//       return;
//     }


//     try {

//       setLoading(true);

//       await api.put(
//         "/auth/change-password",
//         {
//           currentPassword:
//             formData.currentPassword,

//           newPassword:
//             formData.newPassword,
//         }
//       );


//       setSuccess(
//         "Password changed successfully."
//       );


//       setFormData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });


//       setTimeout(() => {

//         const user =
//           JSON.parse(
//             localStorage.getItem("user")
//           );

//         if (user.role === "ADMIN") {
//           navigate("/admin");
//         } else if (user.role === "USER") {
//           navigate("/user");
//         } else if (user.role === "OWNER") {
//           navigate("/owner");
//         }

//       }, 1500);


//     } catch (error) {

//       setError(
//         error.response?.data?.message ||
//         "Failed to change password."
//       );

//     } finally {

//       setLoading(false);

//     }
//   };


//   return (
//     <>
//       <Navbar />

//       <div className="auth-container">

//         <h1>Change Password</h1>


//         {error && (
//           <p className="error">
//             {error}
//           </p>
//         )}


//         {success && (
//           <p className="success">
//             {success}
//           </p>
//         )}
//         <form onSubmit={handleSubmit}>
//           <input
//             type="password"
//             name="currentPassword"
//             placeholder="Current Password"
//             value={
//               formData.currentPassword
//             }
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="newPassword"
//             placeholder="New Password"
//             value={
//               formData.newPassword
//             }
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm New Password"
//             value={
//               formData.confirmPassword
//             }
//             onChange={handleChange}
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//           >
//             {loading
//               ? "Changing..."
//               : "Change Password"}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default ChangePassword;



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