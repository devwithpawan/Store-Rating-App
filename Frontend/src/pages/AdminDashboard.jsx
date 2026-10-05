import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, Store, Star, ArrowUpDown, X, Eye, } from "lucide-react";
import api from "../services/api";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [owners, setOwners] = useState([]);

    const [showUserModal, setShowUserModal] = useState(false);
    const [showStoreModal, setShowStoreModal] = useState(false);

    const [loading, setLoading] = useState(true);

    const [showUserForm, setShowUserForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState("");
    const [storeLoading, setStoreLoading] = useState(false);
    const [storeError, setStoreError] = useState("");

    const [userSort, setUserSort] = useState({
        field: "name",
        order: "ASC",
    });

    const [storeSort, setStoreSort] = useState({
        field: "name",
        order: "ASC",
    });

    const [userFilters, setUserFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: "",
    });

    const [storeFilters, setStoreFilters] = useState({
        name: "",
        email: "",
        address: "",
    });

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
    });

    const [newStore, setNewStore] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: "",
    });

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
    });

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: "",
    });

    // =========================
    // LOAD DASHBOARD
    // =========================

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [
                dashboardResponse,
                usersResponse,
                storesResponse,
                ownersResponse,
            ] = await Promise.all([
                api.get("/admin/dashboard"),
                api.get("/admin/users"),
                api.get("/admin/stores"),
                api.get("/admin/owners"),
            ]);

            setStats(dashboardResponse.data);
            setUsers(usersResponse.data);
            setStores(storesResponse.data);
            setOwners(ownersResponse.data);
        } catch (error) {
            console.error(
                "Dashboard error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadOwners = async () => {
        try {
            const response = await api.get("/admin/owners");
            setOwners(response.data.owners || response.data || []);
        } catch (error) {
            console.error("Failed to load owners:", error);
        }
    };

    useEffect(() => {
        loadDashboard();
        loadOwners();
    }, []);

    // =========================
    // SEARCH USERS
    // =========================

    const searchUsers = async () => {
        try {
            const params = new URLSearchParams();

            Object.entries(userFilters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            params.append("sortBy", userSort.field);
            params.append("order", userSort.order);

            const response = await api.get(
                `/admin/users?${params.toString()}`
            );

            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // =========================
    // SEARCH STORES
    // =========================

    const searchStores = async () => {
        try {
            const params = new URLSearchParams();

            Object.entries(storeFilters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            params.append("sortBy", storeSort.field);
            params.append("order", storeSort.order);

            const response = await api.get(
                `/admin/stores?${params.toString()}`
            );

            setStores(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // =========================
    // SORT USERS
    // =========================

    const sortUser = async (field) => {
        const order =
            userSort.field === field && userSort.order === "ASC"
                ? "DESC"
                : "ASC";

        try {
            const params = new URLSearchParams();

            Object.entries(userFilters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            params.append("sortBy", field);
            params.append("order", order);

            const response = await api.get(
                `/admin/users?${params.toString()}`
            );

            setUsers(response.data);

            setUserSort({
                field,
                order,
            });
        } catch (error) {
            console.error(error);
        }
    };

    // =========================
    // SORT STORES
    // =========================

    const sortStore = async (field) => {
        const order =
            storeSort.field === field && storeSort.order === "ASC"
                ? "DESC"
                : "ASC";

        try {
            const params = new URLSearchParams();

            Object.entries(storeFilters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            params.append("sortBy", field);
            params.append("order", order);

            const response = await api.get(
                `/admin/stores?${params.toString()}`
            );

            setStores(response.data);

            setStoreSort({
                field,
                order,
            });
        } catch (error) {
            console.error(error);
        }
    };

    // =========================
    // CREATE USER
    // =========================

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            await api.post("/admin/users", newUser);

            alert("User created successfully");

            setNewUser({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER",
            });

            setShowUserForm(false);

            loadDashboard();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create user"
            );
        }
    };

    // =========================
    // CREATE STORE
    // =========================

    const handleAddStore = async (e) => {
        e.preventDefault();

        try {
            await api.post("/admin/stores", {
                name: newStore.name,
                email: newStore.email,
                address: newStore.address,
                ownerId: newStore.ownerId
                    ? Number(newStore.ownerId)
                    : null,
            });

            alert("Store created successfully");

            setNewStore({
                name: "",
                email: "",
                address: "",
                ownerId: "",
            });

            setShowStoreForm(false);

            loadDashboard();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create store"
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const handleUserInputChange = (e) => {
        const { name, value } = e.target;

        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        setUserError("");

        // Name validation
        if (userForm.name.length < 20 || userForm.name.length > 60) {
            setUserError("Name must be between 20 and 60 characters");
            return;
        }
        if (userForm.address.length > 400) {
            setUserError("Address cannot exceed 400 characters");
            return;
        }

        try {
            setUserLoading(true);

            await api.post("/admin/users", userForm);

            alert("User created successfully");

            setUserForm({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER",
            });

            setShowUserModal(false);

            // Dashboard/users data reload
            loadUsers();

        } catch (error) {
            setUserError(
                error.response?.data?.message || "Failed to create user"
            );
        } finally {
            setUserLoading(false);
        }
    };

    const handleStoreInputChange = (e) => {
        const { name, value } = e.target;

        setStoreForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();

        setStoreError("");

        if (storeForm.name.length < 1 || storeForm.name.length > 60) {
            setStoreError("Store name must be between 1 and 60 characters");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(storeForm.email)) {
            setStoreError("Please enter a valid email address");
            return;
        }

        if (storeForm.address.length > 400) {
            setStoreError("Address cannot exceed 400 characters");
            return;
        }

        if (!storeForm.ownerId) {
            setStoreError("Please select a store owner");
            return;
        }

        try {
            setStoreLoading(true);

            await api.post("/admin/stores", {
                name: storeForm.name,
                email: storeForm.email,
                address: storeForm.address,
                ownerId: Number(storeForm.ownerId),
            });

            alert("Store created successfully");

            setStoreForm({
                name: "",
                email: "",
                address: "",
                ownerId: "",
            });

            setShowStoreModal(false);

            // Refresh stores
            loadStores();

        } catch (error) {
            setStoreError(
                error.response?.data?.message ||
                "Failed to create store"
            );
        } finally {
            setStoreLoading(false);
        }
    };



    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
                <main className="page">
                    <div className="loading">
                        Loading dashboard...
                    </div>
                </main>
        );
    }

    return (
        <>
            <main className="page">
                <div className="page-container">

                    {/* ================= HEADER ================= */}

                    <div className="page-header">
                        <div>
                            <p className="eyebrow">
                                ADMINISTRATION
                            </p>

                            <h1>Dashboard</h1>

                            <p className="page-description">
                                Manage users, stores and ratings.
                            </p>
                        </div>

                        <div className="header-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() =>
                                    setShowUserForm(true)
                                }
                            >
                                <Plus size={17} />
                                Add User
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    setShowStoreForm(true)
                                }
                            >
                                <Plus size={17} />
                                Add Store
                            </button>
                        </div>
                    </div>

                    {/* ================= STATS ================= */}

                    <section className="stats-grid">

                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={20} />
                            </div>

                            <div>
                                <p>Total Users</p>
                                <h2>{stats.totalUsers}</h2>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <Store size={20} />
                            </div>

                            <div>
                                <p>Total Stores</p>
                                <h2>{stats.totalStores}</h2>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <Star size={20} />
                            </div>

                            <div>
                                <p>Total Ratings</p>
                                <h2>{stats.totalRatings}</h2>
                            </div>
                        </div>

                    </section>

                    {/* ================= STORES ================= */}

                    <section className="section">

                        <div className="section-header">

                            <div>
                                <h2>Stores</h2>
                                <p>
                                    Manage registered stores.
                                </p>
                            </div>

                            {/* <button
                                className="btn btn-primary"
                                onClick={() =>
                                    setShowStoreForm(true)
                                }
                            >
                                <Plus size={17} />
                                Add Store
                            </button> */}
                            <button
                                className="admin-add-button"
                                onClick={() => {
                                    setStoreError("");
                                    loadOwners();
                                    setShowStoreModal(true);
                                }}
                            >
                                <Plus size={17} />
                                Add Store
                            </button>

                        </div>

                        {/* STORE FILTERS */}

                        <div className="filter-bar">

                            <div className="search-input">
                                <Search size={17} />

                                <input
                                    placeholder="Search store name..."
                                    value={storeFilters.name}
                                    onChange={(e) =>
                                        setStoreFilters({
                                            ...storeFilters,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <input
                                placeholder="Email"
                                value={storeFilters.email}
                                onChange={(e) =>
                                    setStoreFilters({
                                        ...storeFilters,
                                        email: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Address"
                                value={storeFilters.address}
                                onChange={(e) =>
                                    setStoreFilters({
                                        ...storeFilters,
                                        address: e.target.value,
                                    })
                                }
                            />

                            <button
                                className="btn btn-secondary"
                                onClick={searchStores}
                            >
                                Search
                            </button>

                        </div>

                        {/* STORE TABLE */}

                        <div className="table-card">
                            <div className="table-wrapper">

                                <table>

                                    <thead>
                                        <tr>
                                            <th>
                                                <button
                                                    className="table-sort"
                                                    onClick={() =>
                                                        sortStore(
                                                            "name"
                                                        )
                                                    }
                                                >
                                                    Store
                                                    <ArrowUpDown
                                                        size={14}
                                                    />
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    className="table-sort"
                                                    onClick={() =>
                                                        sortStore(
                                                            "email"
                                                        )
                                                    }
                                                >
                                                    Email
                                                    <ArrowUpDown
                                                        size={14}
                                                    />
                                                </button>
                                            </th>

                                            <th>Address</th>

                                            <th>
                                                <button
                                                    className="table-sort"
                                                    onClick={() =>
                                                        sortStore(
                                                            "average_rating"
                                                        )
                                                    }
                                                >
                                                    Rating
                                                    <ArrowUpDown
                                                        size={14}
                                                    />
                                                </button>
                                            </th>

                                            <th>Ratings</th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {stores.length > 0 ? (
                                            stores.map((store) => (
                                                <tr key={store.id}>

                                                    <td>
                                                        <strong>
                                                            {store.name}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {store.email}
                                                    </td>

                                                    <td>
                                                        {store.address ||
                                                            "N/A"}
                                                    </td>

                                                    <td>
                                                        <span className="rating-value">
                                                            <Star
                                                                size={15}
                                                                fill="currentColor"
                                                            />

                                                            {Number(
                                                                store.average_rating ||
                                                                0
                                                            ).toFixed(1)}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {store.total_ratings ??
                                                            0}
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="empty-cell"
                                                >
                                                    No stores found
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        </div>

                    </section>

                    {/* ================= USERS ================= */}

                    <section className="section">

                        <div className="section-header">
                            <div>
                                <h2>Users</h2>
                                <p>Manage registered users</p>
                            </div>

                            <button
                                className="admin-add-button"
                                onClick={() => {
                                    setUserError("");
                                    setShowUserModal(true);
                                }}
                            >

                                <Plus size={17} />
                                Add User
                            </button>

                        </div>

                        {/* USER FILTERS */}

                        <div className="filter-bar">

                            <div className="search-input">
                                <Search size={17} />

                                <input
                                    placeholder="Search name..."
                                    value={userFilters.name}
                                    onChange={(e) =>
                                        setUserFilters({
                                            ...userFilters,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <input
                                placeholder="Email"
                                value={userFilters.email}
                                onChange={(e) =>
                                    setUserFilters({
                                        ...userFilters,
                                        email: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Address"
                                value={userFilters.address}
                                onChange={(e) =>
                                    setUserFilters({
                                        ...userFilters,
                                        address: e.target.value,
                                    })
                                }
                            />

                            <select
                                value={userFilters.role}
                                onChange={(e) =>
                                    setUserFilters({
                                        ...userFilters,
                                        role: e.target.value,
                                    })
                                }
                            >
                                <option value="">
                                    All Roles
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>

                                <option value="USER">
                                    User
                                </option>

                                <option value="OWNER">
                                    Owner
                                </option>
                            </select>

                            <button
                                className="btn btn-secondary"
                                onClick={searchUsers}
                            >
                                Search
                            </button>

                        </div>

                        {/* USER TABLE */}

                        <div className="table-card">
                            <div className="table-wrapper">

                                <table>

                                    <thead>
                                        <tr>

                                            <th>
                                                <button
                                                    className="table-sort"
                                                    onClick={() =>
                                                        sortUser(
                                                            "name"
                                                        )
                                                    }
                                                >
                                                    Name
                                                    <ArrowUpDown
                                                        size={14}
                                                    />
                                                </button>
                                            </th>

                                            <th>
                                                <button
                                                    className="table-sort"
                                                    onClick={() =>
                                                        sortUser(
                                                            "email"
                                                        )
                                                    }
                                                >
                                                    Email
                                                    <ArrowUpDown
                                                        size={14}
                                                    />
                                                </button>
                                            </th>

                                            <th>Address</th>

                                            <th>
                                                <button
                                                    className="table-sort"
                                                    onClick={() =>
                                                        sortUser(
                                                            "role"
                                                        )
                                                    }
                                                >
                                                    Role
                                                    <ArrowUpDown
                                                        size={14}
                                                    />
                                                </button>
                                            </th>

                                            <th>Action</th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id}>

                                                    <td>
                                                        <strong>
                                                            {user.name}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {user.email}
                                                    </td>

                                                    <td>
                                                        {user.address ||
                                                            "N/A"}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`role-badge role-${user.role.toLowerCase()}`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="icon-button"
                                                            title="View user"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/users/${user.id}`
                                                                )
                                                            }
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="empty-cell"
                                                >
                                                    No users found
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        </div>

                    </section>

                </div>
            </main>

            {/* ================= ADD USER MODAL ================= */}

            {showUserForm && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowUserForm(false)
                    }
                >
                    <div
                        className="modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>
                                <h2>Add User</h2>
                                <p>
                                    Create a new platform user.
                                </p>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowUserForm(false)
                                }
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <form
                            className="form"
                            onSubmit={handleAddUser}
                        >

                            <label>
                                Name
                                <input
                                    name="name"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter full name"
                                    required
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Enter email"
                                    required
                                />
                            </label>

                            <label>
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="Enter password"
                                    required
                                />
                            </label>

                            <label>
                                Address
                                <textarea
                                    name="address"
                                    value={newUser.address}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            address: e.target.value,
                                        })
                                    }
                                    placeholder="Enter address"
                                    rows="3"
                                    required
                                />
                            </label>

                            <label>
                                Role
                                <select
                                    name="role"
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            role: e.target.value,
                                        })
                                    }
                                >
                                    <option value="USER">
                                        Normal User
                                    </option>

                                    <option value="ADMIN">
                                        Administrator
                                    </option>

                                    <option value="OWNER">
                                        Store Owner
                                    </option>
                                </select>
                            </label>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowUserForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Create User
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* ================= ADD STORE MODAL ================= */}

            {showStoreForm && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowStoreForm(false)
                    }
                >
                    <div
                        className="modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>
                                <h2>Add Store</h2>
                                <p>
                                    Register a new store.
                                </p>
                            </div>

                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowStoreForm(false)
                                }
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <form
                            className="form"
                            onSubmit={handleAddStore}
                        >

                            <label>
                                Store Name
                                <input
                                    name="name"
                                    value={newStore.name}
                                    onChange={(e) =>
                                        setNewStore({
                                            ...newStore,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter store name"
                                    required
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={newStore.email}
                                    onChange={(e) =>
                                        setNewStore({
                                            ...newStore,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Store email"
                                    required
                                />
                            </label>

                            <label>
                                Address
                                <textarea
                                    name="address"
                                    value={newStore.address}
                                    onChange={(e) =>
                                        setNewStore({
                                            ...newStore,
                                            address: e.target.value,
                                        })
                                    }
                                    placeholder="Store address"
                                    rows="3"
                                    required
                                />
                            </label>

                            <label>
                                Store Owner

                                <select
                                    name="ownerId"
                                    value={newStore.ownerId}
                                    onChange={(e) =>
                                        setNewStore({
                                            ...newStore,
                                            ownerId: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        Select store owner
                                    </option>

                                    {owners.map((owner) => (
                                        <option
                                            key={owner.id}
                                            value={owner.id}
                                        >
                                            {owner.name} —{" "}
                                            {owner.email}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowStoreForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Create Store
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {showStoreModal && (
                <div className="modal-overlay">

                    <div className="modal-card">

                        <div className="modal-header">
                            <div>
                                <h2>Add Store</h2>
                                <p>Create a new store</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowStoreModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {storeError && (
                            <div className="form-error">
                                {storeError}
                            </div>
                        )}

                        <form onSubmit={handleCreateStore}>

                            {/* Store Name */}
                            <div className="form-group">
                                <label>Store Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={storeForm.name}
                                    onChange={handleStoreInputChange}
                                    placeholder="Enter store name"
                                    maxLength={60}
                                    required
                                />

                                <small>
                                    {storeForm.name.length}/60 characters
                                </small>
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={storeForm.email}
                                    onChange={handleStoreInputChange}
                                    placeholder="Enter store email"
                                    required
                                />
                            </div>

                            {/* Address */}
                            <div className="form-group">
                                <label>Address</label>

                                <textarea
                                    name="address"
                                    value={storeForm.address}
                                    onChange={handleStoreInputChange}
                                    placeholder="Enter store address"
                                    maxLength={400}
                                    rows={3}
                                />

                                <small>
                                    {storeForm.address.length}/400 characters
                                </small>
                            </div>

                            {/* Owner */}
                            <div className="form-group">
                                <label>Store Owner</label>

                                <select
                                    name="ownerId"
                                    value={storeForm.ownerId}
                                    onChange={handleStoreInputChange}
                                    required
                                >
                                    <option value="">
                                        Select owner
                                    </option>

                                    {owners.map((owner) => (
                                        <option
                                            key={owner.id}
                                            value={owner.id}
                                        >
                                            {owner.name} — {owner.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => setShowStoreModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={storeLoading}
                                >
                                    {storeLoading
                                        ? "Creating..."
                                        : "Create Store"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal-card">

                        <div className="modal-header">
                            <div>
                                <h2>Add User</h2>
                                <p>Create a new system user</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowUserModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {userError && (
                            <div className="form-error">
                                {userError}
                            </div>
                        )}

                        <form onSubmit={handleCreateUser}>

                            <div className="form-group">
                                <label>Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={userForm.name}
                                    onChange={handleUserInputChange}
                                    placeholder="Enter full name"
                                    maxLength={60}
                                    required
                                />

                                <small>
                                    {userForm.name.length}/60 characters
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={userForm.email}
                                    onChange={handleUserInputChange}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>

                                <input
                                    type="password"
                                    name="password"
                                    value={userForm.password}
                                    onChange={handleUserInputChange}
                                    placeholder="Enter password"
                                    minLength={8}
                                    maxLength={16}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Address</label>

                                <textarea
                                    name="address"
                                    value={userForm.address}
                                    onChange={handleUserInputChange}
                                    placeholder="Enter address"
                                    maxLength={400}
                                    rows={3}
                                />

                                <small>
                                    {userForm.address.length}/400 characters
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Role</label>

                                <select
                                    name="role"
                                    value={userForm.role}
                                    onChange={handleUserInputChange}
                                >
                                    <option value="USER">Normal User</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => setShowUserModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={userLoading}
                                >
                                    {userLoading ? "Creating..." : "Create User"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </>
    );
};

export default AdminDashboard;