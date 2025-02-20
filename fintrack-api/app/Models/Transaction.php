<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use App\Models\{User, FinancialTarget};

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;
    protected $fillable = [
        'amount',
        'name',
        'description',
    ];
    
    public function financialTarget(): BelongsTo {
        return $this->belongsTo(FinancialTarget::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
