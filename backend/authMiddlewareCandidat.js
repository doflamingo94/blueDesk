const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader) {
        return req.sendStatus(401)
    }
    
    const data = jwt.verify(authHeader, 'codesecret')
    
    next()
}