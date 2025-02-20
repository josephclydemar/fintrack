<?php

namespace App\Rules\FinancialTarget;

use Closure;
use Illuminate\Contracts\Validation\{ValidationRule, DataAwareRule};
use App\Models\FinancialTarget;

class UserScopedUniqueNameRule implements ValidationRule, DataAwareRule
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
        $financialTarget = FinancialTarget::where('user_id', $userId)->first();
        if($financialTarget !== null && $value === $financialTarget->name) {
            $fail('That ' . $attribute . ' is already taken');
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
