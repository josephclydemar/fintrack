<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Auth\{SessionGuard, RequestGuard};
use Illuminate\Support\Facades\{Auth, Hash, Log};
use Illuminate\Support\Sleep;
use Ichtrojan\Otp\Otp;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\{RegisterRequest, LoginRequest, OtpRequest, ResendOtpRequest};
use App\Http\Resources\V1\User\UserResource;
use App\Jobs\{PopulateFinancialProfileJob, PopulateUserSettingsJob};

const TIMEZONE = 'Asia/Manila';


class AuthController extends Controller
{
    // keys
    private string $user = 'user';
    private string $mfa = 'mfa';
    private string $otpCode = 'otp_code';
    private string $authenticatedEmail = 'authenticated_email';
    private string $apiAccessToken = 'api_access_token';

    private string $firstName = 'first_name';
    private string $lastName = 'last_name';
    private string $email = 'email';
    private string $password = 'password';

    /**
     * Register new user
     */
    public function register(RegisterRequest $request)
    {
        $fields = $request->only([$this->firstName, $this->lastName, $this->email, $this->password]);
        $newUser = User::create($fields);

        PopulateFinancialProfileJob::dispatch($newUser);
        PopulateUserSettingsJob::dispatch($newUser);

        Auth::login($newUser);
        $newToken = $newUser->createToken($newUser->email, ['*'], now(TIMEZONE)->addHours(5));
        
        Sleep::for(1)->second();
        return $this->response(
            code: 201,
            data: [
                $this->user => new UserResource($newUser),
                $this->apiAccessToken => $newToken->plainTextToken,
            ],
        );
    }

    /**
     * Login registered user
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only([$this->email, $this->password]);
        Sleep::for(1)->second();

        /** @var User $user */
        $user = User::where($this->email, $credentials[$this->email])->first();
        if($user !== null && Hash::check($credentials[$this->password], $user->password)) {
            $mfaSettingValue = json_decode($user->userSettings()->where('key', 'mfa_auth')->first()->value);
            $isMfaEnabled = data_get($mfaSettingValue, 'value', false);
            if($isMfaEnabled) {
                $otp = (new Otp)->generate($credentials[$this->email], 'numeric', 6, 2);
                if($otp->status === true) {
                    Log::info(['login_otp' => $otp->token]);
                    return $this->response(
                        data: [$this->mfa => true, $this->authenticatedEmail => $credentials[$this->email]],
                        message: 'OTP sent to your email ' . $user->email,
                    );
                }
                return $this->response(
                    status: false,
                    code: 500,
                    message: 'Failed to generate OTP.',
                );
            }
            if(Auth::attempt($credentials)) {
                /** @var User $user */
                $user = Auth::user();
                $newToken = $user->createToken($user->email, ['*'], now(TIMEZONE)->addHours(5));
                return $this->response(data: [
                    $this->mfa => false,
                    $this->user => new UserResource($user),
                    $this->apiAccessToken => $newToken->plainTextToken,
                ]);
            }
        }
        return $this->response(status: false, code: 401, message: 'Incorrect credentials');
    }
    
    /**
     * Validate login OTP
     */
    public function loginOtp(OtpRequest $request)
    {
        $fields = $request->all();
        $email = $fields[$this->email];
        $otp = $fields[$this->otpCode];
        
        Sleep::for(1)->second();

        $otpValidation = (new Otp)->validate($email, $otp);
        if($otpValidation->status) {
            $user = User::where($this->email, $email)->first();
            Auth::login($user);
            /** @var User $user */
            $user = Auth::user();
            $newToken = $user->createToken($user->email, ['*'], now(TIMEZONE)->addHours(5));
            return $this->response(data: [
                $this->mfa => true,
                $this->user => new UserResource($user),
                $this->apiAccessToken => $newToken->plainTextToken,
            ]);
        }
        return $this->response(status: false, code: 401, message: 'Invalid OTP');
    }

    /**
     * Validate register OTP
     */
    public function registerOtp(OtpRequest $request)
    {
        //
    }
    
    /**
     * Send a new OTP
     */
    public function resendOtp(ResendOtpRequest $request)
    {
        $fields = $request->all();
        Sleep::for(1)->second();
        return $this->response(message: 'OTP is resent to '.$fields[$this->email]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $guard = Auth::guard();
        if($guard instanceof SessionGuard) {
            Auth::logout();
        }
        if($guard instanceof RequestGuard) {
            $request->user()->tokens()->delete();
        }
        Sleep::for(1)->second();
        return $this->response(message: 'You are logged out!');
    }
}
