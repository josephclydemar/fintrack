<?php

namespace App\Http\Requests\V1\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Rules\Category\UserScopedUniqueNameRule;

class StoreCategoryRequest extends FormRequest
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
            'name' => ['required', new UserScopedUniqueNameRule],
            'type' => ['required', Rule::in(['INCOME', 'EXPENSE', 'TRANSFER'])],
        ];
    }

    /**
     * Execute before the validation 
     */
    public function prepareForValidation() {
        $this->merge([
            'user_id' => $this->route()->parameter('user', 0),
        ]);
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
