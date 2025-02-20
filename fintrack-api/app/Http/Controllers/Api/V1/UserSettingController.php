<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use App\Models\UserSetting;
use App\Http\Resources\V1\UserSetting\{UserSettingResource, UserSettingCollection};

class UserSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $user)
    {
        $userSettings = UserSetting::where('user_id', $user)->get();
        return $this->response(data: new UserSettingCollection($userSettings));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $user)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $user, string $id)
    {
        $record = UserSetting::where('user_id', $user)->where('id', $id)->first();
        if($record === null) throw new ModelNotFoundException('The requested UserSetting id:' . $id . ' was not found.');
        return $this->response(data: new UserSettingResource($record));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $user, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $user, string $id)
    {
        //
    }
}
