<?php

namespace App\Http\Requests\V1\Transaction;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Validator as ValidatorFacade;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Rules\Transaction\{UserScopedUniqueNameRule, CategoryDependentAmountNotExceedBalanceRule};

class StoreTransactionRequest extends FormRequest
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
            'financial_target_id' => ['bail', 'required', 'integer', 'min:1', 'exists:financial_targets,id'],
            'name' => ['required', new UserScopedUniqueNameRule],
            'description' => ['required'],
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
                'amount' => [
                    'bail',
                    'required',
                    'numeric',
                    'gt:0',
                    new CategoryDependentAmountNotExceedBalanceRule,
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
            'financial_target_id.exists' => 'The financial target id does not exist in the database.',
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
