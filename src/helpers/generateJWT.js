import jwt from 'jsonwebtoken';

const generateJWT = ( uid = '') => {

    const payload = { uid };
    return new Promise(( resolve, reject) => {
        
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, encoded) => {
            if(err){
                console.log(err);
                reject('Something went wrong!!!')
            }
            resolve(encoded)
        } )
    })

}

export default generateJWT;