import jwt from "jsonwebtoken"

const authenticate = async (req, res, next) => {
    
    try {
        const authHeader = req.headers.authorization;
        console.log("Authenticate middleware called", req.method, req.originalUrl);

        // console.log(`Authheaders is: ${authHeader}`)
        // console.log(`All headers is: ${req.headers}`)

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token missing"
            })
        }

        const token = authHeader.split(" ")[1];
        console.log("Token :", token);
        

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("JWT DECODED:", decoded);

        req.user = decoded;

        console.log("req.user :", req.user);
        
        next();
        
    } catch (error) {
        console.error("JWT ERROR:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

export default authenticate;