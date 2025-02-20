<?php

namespace App\Http\Resources\V1\FinancialTarget;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Category\CategoryResource;
use App\Http\Resources\V1\Transaction\TransactionCollection;

class FinancialTargetResource extends JsonResource
{
    protected bool $withTransactions;
    public function __construct(mixed $resource, bool $withTransactions = false)
    {
        // Ensure you call the parent constructor
        parent::__construct($resource);
        $this->withTransactions = $withTransactions;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primary_id = $this->id;
        $category = new CategoryResource($this->category);
        return [
            'financial_target_id' => $this->when($primary_id ?? false, $primary_id),
            'category' => $category->name . ' (' . $category->type . ')',
            'balance' => $this->balance / 100,
            'base_balance' => $this->base_balance / 100,
            'name' => $this->name,
            'description' => $this->description,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'created_at' => $this->created_at,
            'transactions' => $this->when(
                $this->withTransactions, 
                array_merge(
                    ['parent_id' => $this->when($primary_id ?? false, $primary_id)],
                    ['data' => new TransactionCollection($this->transactions)],
                ),
            ),
            // 'add_transaction' => [
            //     'description' => $this->description,
            //     'user_id' => $this->user_id,
            //     'financial_target_id' => $this->when($primary_id ?? false, $primary_id),
            // ],
            // 'edit_transaction' => [
            //     'description' => $this->description,
            //     'user_id' => $this->user_id,
            //     'financial_target_id' => $this->when($primary_id ?? false, $primary_id),
            // ],
        ];
    }
}
