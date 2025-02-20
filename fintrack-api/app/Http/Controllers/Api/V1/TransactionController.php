<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Transaction\{StoreTransactionRequest, UpdateTransactionRequest};
use App\Http\Resources\V1\Transaction\{TransactionResource, TransactionCollection};
use App\Models\{User, Transaction, FinancialTarget, FinancialProfile};

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $user)
    {
        $transactions = Transaction::where('user_id', $user)->with(['financialTarget'])->orderBy('created_at', 'desc')->get();
        return $this->response(data: new TransactionCollection($transactions));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request, string $user)
    {
        $fields = $request->only(['financial_target_id', 'amount', 'name', 'description']);
        $financialTargetId = $fields['financial_target_id'];
        $newTransaction = new Transaction([
            'amount' => $fields['amount'],
            'name' => $fields['name'],
            'description' => $fields['description'],
        ]);

        $financialTarget = FinancialTarget::findOrFail($financialTargetId);
        $categoryType = $financialTarget->category->type;
        
        $financialProfile = FinancialProfile::where('user_id', $user)->first();
        if($categoryType === 'EXPENSE' || $categoryType === 'TRANSFER') {
            $allocatedSavings = $financialProfile->allocated_savings - $newTransaction->amount;
            $totalSavings = $financialProfile->total_savings - $newTransaction->amount;

            $balance = $financialTarget->balance - $newTransaction->amount;

            $financialProfile->update([
                'allocated_savings' => $allocatedSavings,
                'total_savings' => $totalSavings,
            ]);
            $financialTarget->update([
                'balance' => $balance,
            ]);
        } elseif($categoryType === 'INCOME') {
            $unallocatedSavings = $financialProfile->unallocated_savings + $newTransaction->amount;
            $totalSavings = $financialProfile->total_savings + $newTransaction->amount;

            $balance = $financialTarget->balance + $newTransaction->amount;

            $financialProfile->update([
                'unallocated_savings' => $unallocatedSavings,
                'total_savings' => $totalSavings,
            ]);
            $financialTarget->update([
                'balance' => $balance,
            ]);
        }

        $newTransaction->user()->associate(User::findOrFail($user));
        $newTransaction->financialTarget()->associate($financialTarget);
        $newTransaction->save();
        return $this->response(code: 201, data: new TransactionResource($newTransaction));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $user, string $id)
    {
        $record = Transaction::where('user_id', $user)->where('id', $id)->first();
        if($record === null) throw new ModelNotFoundException('The requested Transaction id:' . $id . ' was not found.');
        return $this->response(data: new TransactionResource($record));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
