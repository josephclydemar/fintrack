<?php

namespace App\Http\Resources\V1\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\FinancialTarget\FinancialTargetCollection;

class UserResource extends JsonResource
{
    protected bool $withFinancialTargets;
    public function __construct(mixed $resource, bool $withFinancialTargets = false)
    {
        // Ensure you call the parent constructor
        parent::__construct($resource);
        $this->withFinancialTargets = $withFinancialTargets;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primary_id = $this->id;
        return [
            'id' => $this->when($primary_id ?? false, $primary_id),
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'created_at' => $this->created_at,
            'financial_targets' => $this->when($this->withFinancialTargets, new FinancialTargetCollection($this->financialTargets)),
        ];
    }
}
