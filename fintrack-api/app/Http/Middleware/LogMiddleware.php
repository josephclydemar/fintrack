<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\{Auth, Log, Artisan};

class LogMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // $method = $request->method();
        // $path = $request->path();
        Log::info('REQUEST: ' . $request);
        // Artisan::call('app:log-request', [
        //     'request' => $method . ' ' . $path,
        // ]);
        return $next($request);
    }
}

