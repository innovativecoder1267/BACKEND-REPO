import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asynhandler from "../utils/asynchandler";


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res.status(OK)
    .json(new ApiResponse("healthcheck done"))
})

export {
    healthcheck
    }
    