export const protect = async (req, res, next) => {
    try {

        const { userId } = req.auth;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        req.userId = userId;

        next();

    } catch (error) {

        console.log("Protect middleware error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};