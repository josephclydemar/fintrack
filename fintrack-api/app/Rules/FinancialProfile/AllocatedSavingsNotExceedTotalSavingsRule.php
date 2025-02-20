<?php

namespace App\Rules\FinancialProfile;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllocatedSavingsNotExceedTotalSavingsRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //
    }
}
