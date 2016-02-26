var bcrypt = require('bcrypt'),
    _ = require('lodash'),
    cryptojs = require('crypto-js'),
    jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        accountName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        firstName: {
          type: DataTypes.STRING,
          unique: false,
          allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10),
                    hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: function(user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods: {
            authenticate: function (body) {
                return new Promise(function (resolve, reject) {
                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }

                    user.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function (user) {
                        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                            return reject();
                        }
                        resolve(user);
                    }, function () {
                        reject();
                    });
                });
            },
            findByToken: function (token) {
                return new Promise(function (resolve, reject) {
                   try {
                       var decodedJWT = jwt.verify(token, 'token'),
                           bytes = cryptojs.AES.decrypt(decodedJWT.token, 'encrypt'),
                           tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

                       user.findById(tokenData.id).then(function (user) {
                           if (!user) {
                               reject();
                           } else {
                               resolve(user);
                           }
                       }, function (e) {
                           console.log('Error in Find ID: ', e);
                           reject();
                       });
                   } catch (e) {
                       console.log('Error: ', e);
                       reject();
                   }
                });
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt', 'token');
            },
            generateToken: function (type) {
                var encryptedData,
                    stringData = JSON.stringify({id: this.get('id'), type: type}),
                    token;
                if (!_.isString(type)) {
                    return undefined;
                }

                try {
                    encryptedData = cryptojs.AES.encrypt(stringData, 'token').toString();
                    token = jwt.sign({
                        token: encryptedData
                    }, 'encrypt');

                    return token;
                } catch(e) {
                    console.log('Failure to create token', e);
                    return undefined;
                }
            }
        }
    });

    return user;
};
