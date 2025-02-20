<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\{User, UserSetting};

class PopulateUserSettingsJob implements ShouldQueue
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
        $initialValues = config('settings_blueprint.user_settings');
        foreach($initialValues as $setting) {
            $attributes = [
                'key' => $setting['key'],
                'type' => $setting['type'],
                'value' => json_encode($setting['value']),
            ];
            $newUserSetting = new UserSetting($attributes);
            $newUserSetting->user()->associate($this->user);
            $newUserSetting->save();
        }
    }
}
