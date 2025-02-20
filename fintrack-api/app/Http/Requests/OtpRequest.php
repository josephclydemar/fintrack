<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class OtpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'exists:users'],
            'otp_code' => ['required', 'size:6'],
        ];
    }
    
    /**
     * Custom validation error messages
     */
    public function messages()
    {
        return [
            'email.exists' => 'The account for the entered email does not exist.',
        ];
    }

    /**
     * Customize validation error http response
     */
    protected function failedValidation(Validator $validator)
    {
        $response = [
            'success' => false,
            'data' => null,
            'message' => $validator->errors()->first(),
            'error' => $validator->errors()->toArray(),
        ];
        throw new HttpResponseException(response()->json($response, 422));
    }
}
