<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Base response method.
     */
    public function response(
                            bool $status = true,
                            mixed $data = null,
                            int $code = 200,
                            string $message = 'success',
                            mixed $error = [],
                        ): JsonResponse
    {
        $response = [
            'success' => $status,
            'data' => $data,
            'message' => $message,
            'error' => $error,
        ];
        return response()->json($response, $code);
    }
}
