<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\{User, FinancialProfile};

class PopulateFinancialProfileJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $newFinancialProfile = new FinancialProfile();
        $newFinancialProfile->user()->associate($this->user);
        $newFinancialProfile->save();
    }
}
