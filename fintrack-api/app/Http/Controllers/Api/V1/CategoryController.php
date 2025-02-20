<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use App\Models\{User, Category};
use App\Http\Requests\V1\Category\{StoreCategoryRequest, UpdateCategoryRequest};
use App\Http\Resources\V1\Category\{CategoryResource, CategoryCollection};

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $user)
    {
        $categories = Category::where('user_id', $user)->orderBy('created_at', 'desc')->get();
        return $this->response(data: new CategoryCollection($categories));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request, string $user)
    {
        $fields = $request->only(['name', 'type']);
        $newCategory = new Category($fields);
        $newCategory->user()->associate(User::findOrFail($user));
        $newCategory->save();
        return $this->response(code: 201, data: new CategoryResource($newCategory));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $user, string $id)
    {
        $record = Category::where('user_id', $user)->where('id', $id)->first();
        if($record === null) throw new ModelNotFoundException('The requested Category id:' . $id . ' was not found.');
        return $this->response(data: new CategoryResource($record));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
