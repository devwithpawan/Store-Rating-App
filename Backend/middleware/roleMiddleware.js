const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        console.log("ROLE CHECK");
        console.log("User role:", req.user?.role);
        console.log("Allowed roles:", allowedRoles);

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication is required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};

export default authorize;