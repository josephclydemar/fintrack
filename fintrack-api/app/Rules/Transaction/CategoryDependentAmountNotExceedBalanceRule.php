<?php

namespace App\Rules\Transaction;

use Closure;
use Illuminate\Contracts\Validation\{ValidationRule, DataAwareRule};
use App\Models\FinancialTarget;

class CategoryDependentAmountNotExceedBalanceRule implements ValidationRule, DataAwareRule
{
    /**
     * All of the data under validation.
     *
     * @var array<string, mixed>
     */
    protected $data = [];

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $financialTargetId = $this->data['financial_target_id'];
        $financialTarget = FinancialTarget::find($financialTargetId);
        $categoryType = $financialTarget->category->type;
        if($categoryType === 'EXPENSE' || $categoryType === 'TRANSFER') {
            if($value > $financialTarget->balance) {
                $fail('The ' . $attribute . ' needs to be less than or equal to the Financial Target\'s balance.');
            }
        }
    }

    /**
     * Set the data under validation.
     *
     * @param  array<string, mixed>  $data
     */
    public function setData(array $data): static
    {
        $this->data = $data;
        return $this;
    }
}
