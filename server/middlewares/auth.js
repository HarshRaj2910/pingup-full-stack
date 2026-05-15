export const protect = async (req, res, next) => {
    try {
        console.log('Protect middleware - headers:', req.headers.authorization || req.headers);
        const authResult = await req.auth();
        console.log('Protect middleware - req.auth() result:', authResult);
        const {userId} = authResult || {};
        if(!userId){
            console.log('Protect middleware - not authenticated');
            return res.json({success: false, message: "not authenticated"  })
        }
        next()
    } catch (error) {
        res.json({success: false, message: error.message  })
    }
}