export class InvalidArgumentException extends Error {
    constructor(argumentName, expectedType = "object") {
        const message = `Invalid argument: '${argumentName}' must be of type '${expectedType}'.`;
        super(message);
        this.name = "InvalidArgumentException";
        this.argumentName = argumentName;
        this.expectedType = expectedType;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ApiRequestFailedException extends Error {
    /**
     * @param {string} requestName 
     * @param {object} response 
     */
    constructor(requestName, response) {
        const message = `Request fail: '${requestName}'`;
        super(message);
        this.name = "ApiRequestFailedException";
        this.requestName = requestName;
        this.response = response;
        this.timestamp = new Date();
        Error.captureStackTrace(this, this.constructor);
    }
    
    toString() {
        return `${this.name}: ${this.message}\nResponse: ${JSON.stringify(this.response, null, 2)}`;
    }
}



/**
 * AuthenticationException: Thrown when authentication fails.
 * AuthorizationException: Thrown when a user is unauthorized to perform an action.
 * PaymentException: Thrown when a payment-related issue occurs.
 * ResourceNotFoundException: Thrown when a resource (e.g., user, file, etc.) is not found.
 * 
 * InvalidInputException: Thrown when user input is invalid.
 * DataFormatException: Thrown when data does not match the expected format.
 * RangeException: Thrown when a value is out of the expected range.
 * 
 * ApiRequestException: Thrown when an API request fails.
 * NetworkException: Thrown when a network connection issue occurs.
 * TimeoutException: Thrown when an operation exceeds the allowed time.
 * 
 * MissingConfigException: Thrown when a required configuration is missing.
 * InvalidConfigException: Thrown when a configuration value is invalid.
 * 
 */