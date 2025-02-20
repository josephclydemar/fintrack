<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class UserSetting extends Model
{
    /** @use HasFactory<\Database\Factories\UserSettingFactory> */
    use HasFactory;
    
    protected $fillable = [
        'key',
        'type',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];
    
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
