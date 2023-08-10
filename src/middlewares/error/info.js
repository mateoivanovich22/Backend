import EErrors from '../../services/errors/enums.js';
import log from "../../config/logger.js"

export default (error, req, res, next) => {
    log.info(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            res.send({error: error.name});
            break;
        case EErrors.ROUTING_ERROR:
                res.send({error: 'error de ruteo'});
                break;
        case EErrors.ROUTING_ERROR:
                res.send({error: 'error de parametros'});
                break;
        default:
            res.send({error: "unhandled error"});
            break;
    }
}