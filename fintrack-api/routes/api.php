<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{UserSettingController, FinancialProfileController, CategoryController, FinancialTargetController, TransactionController, BlueprintController};
use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\AuthorizeUserMiddleware;

$SANCTUM_MIDDLEWARE = 'auth:sanctum';
$URI_GENERIC = '/';
$URI_WITH_ID = '/{id}';

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware($SANCTUM_MIDDLEWARE);


Route::prefix('auth')->controller(AuthController::class)->group(function () use($SANCTUM_MIDDLEWARE) {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/login/otp', 'loginOtp');
    Route::post('/otp/resend', 'resendOtp');
    Route::post('/users/{user}/logout', 'logout')->middleware([
            $SANCTUM_MIDDLEWARE,
            AuthorizeUserMiddleware::class,
        ]);
});

Route::prefix('v1')->middleware([
        $SANCTUM_MIDDLEWARE,
        AuthorizeUserMiddleware::class,
    ])->group(function () use($URI_GENERIC, $URI_WITH_ID) {
    Route::prefix('/users/{user}')->group(function () use($URI_GENERIC, $URI_WITH_ID) {
        Route::prefix('user_settings')->controller(UserSettingController::class)->group(function () use($URI_GENERIC, $URI_WITH_ID) {
            Route::get($URI_GENERIC, 'index');
            Route::get($URI_WITH_ID, 'show');
        });
        Route::prefix('financial_profile')->controller(FinancialProfileController::class)->group(function () use ($URI_GENERIC) {
            Route::get($URI_GENERIC, 'getUserFinancialProfile');
            Route::put($URI_GENERIC, 'updateUserFinancialProfile');
        });
        Route::prefix('categories')->controller(CategoryController::class)->group(function () use($URI_GENERIC, $URI_WITH_ID) {
            Route::get($URI_GENERIC, 'index');
            Route::post($URI_GENERIC, 'store');
            Route::get($URI_WITH_ID, 'show');
        });
        Route::prefix('financial_targets')->controller(FinancialTargetController::class)->group(function () use($URI_GENERIC, $URI_WITH_ID) {
            Route::get($URI_GENERIC, 'index');
            Route::post($URI_GENERIC, 'store');
            Route::get($URI_WITH_ID, 'show');
        });
        Route::prefix('transactions')->controller(TransactionController::class)->group(function () use($URI_GENERIC, $URI_WITH_ID) {
            Route::get($URI_GENERIC, 'index');
            Route::post($URI_GENERIC, 'store');
            Route::get($URI_WITH_ID, 'show');
        });
        Route::controller(BlueprintController::class)->group(function () {
            Route::get('/grid_blueprints/{id}', 'getGridBlueprint');
            Route::get('/chart_blueprint/{id}', 'getChartBlueprint');
        });
    });
    
});

