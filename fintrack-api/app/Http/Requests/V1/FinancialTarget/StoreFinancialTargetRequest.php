<?php

namespace App\Http\Requests\V1\FinancialTarget;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Validator as ValidatorFacade;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Rules\FinancialTarget\{UserScopedUniqueNameRule, CategoryDependentBalanceRule, BalanceNotExceedUnallocatedSavingsRule};

class StoreFinancialTargetRequest extends FormRequest
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
            'category_id' => ['bail', 'required', 'integer', 'min:1', 'exists:categories,id'],
            'name' => ['required', new UserScopedUniqueNameRule],
            'description' => ['required'],
            'start_date' => ['required', 'date_format:Y-m-d H:i:s'],
            'end_date' => ['required', 'date_format:Y-m-d H:i:s'],
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

    public function withValidator(Validator $validator) {
        $validator->after(function (Validator $validator) {
            if($validator->failed()) return;
            ValidatorFacade::make($this->input(), [
                'balance' => [
                    'bail',
                    'required',
                    'numeric',
                    new CategoryDependentBalanceRule,
                    new BalanceNotExceedUnallocatedSavingsRule,
                ],
            ])->validate();
        });
    }

    /**
     * Custom validation error messages
     *
     */
    public function messages()
    {
        return [
            'category_id.exists' => 'The category id does not exist in the database.',
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
