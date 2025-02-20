<?php

namespace App\Http\Resources\V1\FinancialProfile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FinancialProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'allocated_savings' => $this->allocated_savings / 100,
            'unallocated_savings' => $this->unallocated_savings / 100,
            'total_savings' => $this->total_savings / 100,
            'updated_at' => $this->updated_at,
        ];
    }
}
