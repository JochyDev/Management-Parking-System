export function success(res, message, status){
    let statusCode = status || 200;
    let statusMessage = message || '';

    res.status(statusCode).send({
        error: false,
        status: status,
        data: statusMessage
    })
}

export function error(res, message, status){
    let statusCode = status || 500;
    let statusMessage = message || 'Internal Server Error';

    res.status(statusCode).send({
        error: true,
        status: statusCode,
        data: statusMessage
    })
}