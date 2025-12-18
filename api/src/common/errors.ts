export const ErrorCodes = {
    // Accounts
    InvalidJWT: 'invalid_jwt',

    // Generic
    Unauthorized: 'unauthorized',
    Forbidden: 'forbidden',
    BadRequest: 'bad_request',
    InternalServerError: 'internal_server_error',
    AlreadyExist: 'already_exist'
  } as const 