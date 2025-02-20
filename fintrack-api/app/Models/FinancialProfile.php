<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialProfile extends Model
{
    /** @use HasFactory<\Database\Factories\FinancialProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'allocated_savings',
        'unallocated_savings',
        'total_savings',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
