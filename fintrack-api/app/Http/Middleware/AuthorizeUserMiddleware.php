<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\UnauthorizedUserException;
use Illuminate\Support\Facades\Log;

class AuthorizeUserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = (int)$request->route()->parameter('user', 0);
        $authUser = (int)Auth::id();
        Log::debug(['user' => $user, 'auth_user' => $authUser]);
        if($user === 0 || $authUser !== $user) throw new UnauthorizedUserException();
        return $next($request);
    }
}
