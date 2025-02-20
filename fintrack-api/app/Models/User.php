<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\{HasMany, HasOne};
use Laravel\Sanctum\HasApiTokens;
use App\Models\{Category, FinancialTarget, Transaction, UserSetting};

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function categories(): HasMany {
        return $this->hasMany(Category::class);
    }

    public function financialTargets(): HasMany {
        return $this->hasMany(FinancialTarget::class);
    }
    
    public function transactions(): HasMany {
        return $this->hasMany(Transaction::class);
    }

    public function userSettings(): HasMany {
        return $this->hasMany(UserSetting::class);
    }

    public function financialProfile(): HasOne {
        return $this->hasOne(UserSetting::class);
    }
}
