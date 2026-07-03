const jwt = require("jsonwebtoken")

function protect(req,res,next) {
    const authHeader = req.header("Authorization")

    if(!authHeader) {
        return res.status(401).json({message : "NO token,access denied"})
    }

try { 
    const decoded =jwt.verify (authHeader,process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
} catch(err) {
    res.status(401).json({message : "Invalid token"})
}
}

module.exports = protect
