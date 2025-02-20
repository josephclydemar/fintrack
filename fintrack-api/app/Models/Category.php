<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};
use Illuminate\Database\Eloquent\Model;
use App\Models\{User, FinancialTarget};

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
    ];
    
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function financialTargets(): HasMany {
        return $this->hasMany(FinancialTarget::class);
    }
}
