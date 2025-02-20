<?php

namespace App\Http\Resources\V1\Category;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primary_id = $this->id;
        return [
            'category_id' => $this->when($primary_id ?? false, $primary_id),
            'user_id' => $this->user_id,
            'name' => $this->name,
            'type' => $this->type,
            'created_at' => $this->created_at,
        ];
    }
}
