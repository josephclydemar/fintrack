<?php

namespace App\Rules\FinancialTarget;

use Closure;
use Illuminate\Contracts\Validation\{ValidationRule, DataAwareRule};
use App\Models\Category;

class CategoryDependentBalanceRule implements ValidationRule, DataAwareRule
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
        $categoryId = $this->data['category_id'];
        $category = Category::find($categoryId);
        if($category !== null && $category->type === 'INCOME') {
            if($value !== 0) {
                $fail('The ' . $attribute . ' must be 0, if Category type is INCOME.');
            }
        } elseif($category->type === 'EXPENSE' || $category->type === 'TRANSFER') {
            if($value <= 500) {
                $fail('The ' . $attribute . ' must be greater than P5.00, if Category type is EXPENSE or TRANSFER.');
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
