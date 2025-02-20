<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\FinancialTarget\{StoreFinancialTargetRequest, UpdateFinancialTargetRequest};
use App\Http\Resources\V1\FinancialTarget\{FinancialTargetResource, FinancialTargetCollection};
use App\Models\{FinancialTarget, User, Category, FinancialProfile};

class FinancialTargetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $user)
    {
        $withTransactions = $request->query('with_transactions', false);
        return $this->response(data: new FinancialTargetCollection(FinancialTarget::where('user_id', $user)->with(['category'])->orderBy('created_at', 'desc')->get(), $withTransactions));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFinancialTargetRequest $request, string $user)
    {
        $fields = $request->only(['category_id', 'balance', 'name', 'description', 'start_date', 'end_date']);
        $categoryId = $fields['category_id'];
        $newFinancialTarget = new FinancialTarget([
            'balance' => $fields['balance'],
            'base_balance' => $fields['balance'],
            'name' => $fields['name'],
            'description' => $fields['description'],
            'start_date' => $fields['start_date'],
            'end_date' => $fields['end_date'],
        ]);
        $category = Category::findOrFail($categoryId);
        
        if($category->type === 'EXPENSE' || $category->type === 'TRANSFER') {
            $financialProfile = FinancialProfile::where('user_id', $user)->first();

            $unallocatedSavings = $financialProfile->unallocated_savings - $newFinancialTarget->balance;
            $allocatedSavings = $financialProfile->allocated_savings + $newFinancialTarget->balance;
            $financialProfile->update([
                'unallocated_savings' => $unallocatedSavings,
                'allocated_savings' => $allocatedSavings,
            ]);
        }
        $newFinancialTarget->user()->associate(User::findOrFail($user));
        $newFinancialTarget->category()->associate($category);
        $newFinancialTarget->save();
        return $this->response(code: 201, data: new FinancialTargetResource($newFinancialTarget));
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $user, string $id)
    {
        $withTransactions = $request->query('with_transactions', false);
        $record = FinancialTarget::where('user_id', $user)->where('id', $id)->first();
        if($record === null) throw new ModelNotFoundException('The requested FinancialTarget id:' . $id . ' was not found.');
        return $this->response(data: new FinancialTargetResource($record, $withTransactions));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFinancialTargetRequest $request, string $user, string $id)
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
