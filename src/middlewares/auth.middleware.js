exports.isAuthenticated = (req, res, next) => {
    console.log("Session:", req.session);
    console.log("User ID in session:", req.session.userId);
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized: Please log in" });
    }
};