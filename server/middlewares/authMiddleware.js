const jwt = require('jsonwebtoken');

// Check if user logged in or not ? (Token check)
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check karo ki kya request ke header me token aaya hai
        if (req.headers.authorization && req.headers.authorization.startsWith ('Bearer')) {
            // Header me se 'bearer' hata kar sirf asli token string nikalna
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token"
            });
        }

        // Token ko verify krna signature ke sath
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Token ke ander chhupi hui userId aur role ko request ke ander save kar dena
        req.user = decoded;

        next(); // controller par jane ki permission dena
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Not authorized, token failed",
            error: err.message
        });
    }
};

// Check it user is Actually Admin ?
exports.adminOnly = (req, res, next) => {
    // req.user humne upar waale function me decoded token se nikala tha
    if (req.user && req.user.role === 'admin') {
        next(); // if role = admin than go forward
    } else {
        res.status(403).json({
            success: false,
            message: "Access Permission Denied"
        })
    };
}