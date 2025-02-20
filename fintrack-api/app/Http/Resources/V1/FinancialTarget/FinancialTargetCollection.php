<?php

namespace App\Http\Resources\V1\FinancialTarget;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Http\Resources\V1\Category\CategoryResource;
use App\Http\Resources\V1\Transaction\TransactionCollection;

class FinancialTargetCollection extends ResourceCollection
{
    protected bool $withTransactions;
    public function __construct(mixed $resource, bool $withTransactions = false)
    {
        // Ensure you call the parent constructor
        parent::__construct($resource);
        $this->withTransactions = $withTransactions;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->collection->transform(function ($item) {
            $primary_id = $item->id;
            $category = new CategoryResource($item->category);
            return [
                'financial_target_id' => $this->when($primary_id ?? false, $primary_id),
                'category' => $category->name . ' (' . $category->type . ')',
                'balance' => $item->balance / 100,
                'base_balance' => $item->base_balance / 100,
                'name' => $item->name,
                'description' => $item->description,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'created_at' => $item->created_at,
                // 'transactions' => $this->when($this->withTransactions, new TransactionCollection($item->transactions)),
                'transactions' => $this->when(
                    $this->withTransactions, 
                    array_merge(
                        ['parent_id' => $this->when($primary_id ?? false, $primary_id)],
                        ['data' => new TransactionCollection($item->transactions)],
                    ),
                ),
                // 'add_transaction' => [
                //     'description' => $item->description,
                //     'user_id' => $item->user_id,
                //     'financial_target_id' => $this->when($primary_id ?? false, $primary_id),
                // ],
                // 'edit_transaction' => [
                //     'description' => $item->description,
                //     'user_id' => $item->user_id,
                //     'financial_target_id' => $this->when($primary_id ?? false, $primary_id),
                // ],
            ];
        })->toArray();
    }
}
