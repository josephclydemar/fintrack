<?php

namespace App\Http\Requests\V1\FinancialProfile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateFinancialProfileRequest extends FormRequest
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
            'allocated_savings' => ['required', 'numeric'],
            'unallocated_savings' => ['required', 'numeric'],
            'total_savings' => ['required', 'numeric'],
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
