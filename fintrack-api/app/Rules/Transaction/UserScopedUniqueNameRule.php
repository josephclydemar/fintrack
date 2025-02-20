<?php

namespace App\Rules\Transaction;

use Closure;
use Illuminate\Contracts\Validation\{ValidationRule, DataAwareRule};
use App\Models\Transaction;

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
        $transaction = Transaction::where('user_id', $userId)->first();
        if($transaction !== null && $value === $transaction->name) {
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
