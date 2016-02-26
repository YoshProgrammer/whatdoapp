var cryptojs = require('crypto-js');

module.exports = function (db) {

    return {
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth') || '';
            console.log('Token: ', token);

            db.token.findOne({
                where: { tokenHash: cryptojs.MD5(token).toString() }
            }).then(function (tokenInstance) {
                console.log('tokenInstance', tokenInstance);
                if (!tokenInstance) {
                    throw new Error();
                }
                req.token = tokenInstance;
                return db.user.findByToken(token);
            }).then(function (user) {
                req.user = user;
                next();
            }).catch(function (e) {
                console.log('Error: ', e);
                res.status(401).send();
            });
        }
    };
};