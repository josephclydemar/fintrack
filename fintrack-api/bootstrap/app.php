<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\UnauthorizedUserException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\LogMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append([LogMiddleware::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $err) {
            Log::error($err);
            $code = 500;
            if($err instanceof MethodNotAllowedHttpException) {
                $code = 405;
                $errors = $err;
            } elseif($err instanceof AuthenticationException) {
                $code = 401;
                $errors = $err;
            } elseif($err instanceof UnauthorizedUserException) {
                $code = 403;
                $errors = $err;
            } elseif($err instanceof ModelNotFoundException || $err instanceof NotFoundHttpException) {
                $code = 404;
                $errors = $err;
            } elseif($err instanceof ValidationException) {
                $code = 422;
                // $err = $err->errors();
                $errors = $err->errors();
            }
            
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $err->getMessage(),
                'error' => $errors,
            ], $code);
        });
    })->create();
