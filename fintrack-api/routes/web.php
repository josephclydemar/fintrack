<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;

Route::view('/', 'home');
Route::view('/welcome', 'welcome');

Route::get('/token', function (Request $request) {
    $token = $request->session()->token();
    // no sonar
    // $request->session()->regenerate();
    return [
        'token' => $token,
        'env' => App::environment(),
    ];
});

Route::fallback(function () {
    return view('home');
});

