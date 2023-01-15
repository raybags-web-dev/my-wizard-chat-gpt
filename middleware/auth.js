const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ACCESS_TOKEN } = process.env;

module.exports = {
    // function to generate and encript a JWT token 
    generateJWTToken: async(data) => {
        const expiresIn = 60000; // expiration time of token
        return new Promise((resolve, reject) => {
            jwt.sign({ data },
                ACCESS_TOKEN, //secret key
                { expiresIn },
                (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                }
            );
        });
    },
    validateJWTToken: async(token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, ACCESS_TOKEN, (err, decode) => {
                if (err) reject(err);
                resolve(decode);
            });
        });
    }
}