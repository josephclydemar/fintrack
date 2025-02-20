<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};
use Illuminate\Database\Eloquent\Model;
use App\Models\{User, Category, Transaction};

class FinancialTarget extends Model
{
    /** @use HasFactory<\Database\Factories\FinancialTargetFactory> */
    use HasFactory;
    protected $fillable = [
        'balance',
        'base_balance',
        'name',
        'description',
        'start_date',
        'end_date',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }

    public function transactions(): HasMany {
        return $this->hasMany(Transaction::class);
    }
}
