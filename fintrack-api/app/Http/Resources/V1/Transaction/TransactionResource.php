<?php

namespace App\Http\Resources\V1\Transaction;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primary_id = $this->id;
        $financialTarget = $this->financialTarget;
        return [
            'transaction_id' => $this->when($primary_id ?? false, $primary_id),
            'hash' => strtoupper(hash('sha256', json_encode([
                $primary_id,
                $this->financial_target_id,
                $this->description,
                $this->amount,
                $this->created_at,
            ]))),
            'financial_target' => $financialTarget->description,
            'amount' => $this->amount / 100,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => $this->created_at,
        ];
    }
}
