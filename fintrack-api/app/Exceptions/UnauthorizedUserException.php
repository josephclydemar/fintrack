<?php

namespace App\Exceptions;

use Exception;

class UnauthorizedUserException extends Exception
{
    protected $message = 'Unauthorized.';
}
