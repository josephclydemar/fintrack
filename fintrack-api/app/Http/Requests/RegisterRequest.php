<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
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
            'first_name' => ['required'],
            'last_name' => ['required'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:5', 'confirmed'],
        ];
    }

    /**
     * Custom validation error messages
     */
    public function messages()
    {
        return [];
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
