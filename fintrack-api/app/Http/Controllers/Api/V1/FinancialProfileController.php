<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FinancialProfile;
use App\Http\Requests\V1\FinancialProfile\UpdateFinancialProfileRequest;
use App\Http\Resources\V1\FinancialProfile\FinancialProfileResource;

class FinancialProfileController extends Controller
{
    /**
     * Get user's financial profile.
     */
    public function getUserFinancialProfile(string $user)
    {
        $record = FinancialProfile::where('user_id', $user)->first();
        return $this->response(data: new FinancialProfileResource($record));
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function updateUserFinancialProfile(UpdateFinancialProfileRequest $request, string $user)
    {
        $fields = $request->only(['allocated_savings', 'unallocated_savings', 'total_savings']);
        $record = FinancialProfile::where('user_id', $user)->first();
        $record->update($fields);
        return $this->response(data: new FinancialProfileResource($record));
    }
}
