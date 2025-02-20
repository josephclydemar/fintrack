<?php

namespace App\Rules\FinancialTarget;

use Closure;
use Illuminate\Contracts\Validation\{ValidationRule, DataAwareRule};
use App\Models\FinancialProfile;

class BalanceNotExceedUnallocatedSavingsRule implements ValidationRule, DataAwareRule
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
        $userId = $this->data['user_id'];
        $financialProfile = FinancialProfile::where('user_id', $userId)->first();
        if($value > $financialProfile->unallocated_savings) {
            $fail('The Financial Target ' . $attribute . ' must be less than the User\'s Unallocated Savings.');
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
