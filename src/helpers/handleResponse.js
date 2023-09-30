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
    let statusCode;
    let statusMessage;

    if (message instanceof Error) {
        statusCode = message.status || 500;
        statusMessage = message.message || 'Internal Server Error';
    } else {
        statusCode = status || 500;
        statusMessage = message;
    }

    res.status(statusCode).send({
        error: true,
        status: statusCode,
        data: statusMessage
    })
}