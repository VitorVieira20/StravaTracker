<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateGroupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'privacy' => 'required|in:public,private',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => __('groups_validation_name_required'),
            'name.string' => __('groups_validation_name_string'),
            'name.max' => __('groups_validation_name_max'),
            'description.string' => __('groups_validation_description_string'),
            'description.max' => __('groups_validation_description_max'),
            'privacy.required' => __('groups_validation_privacy_required'),
            'privacy.in' => __('groups_validation_privacy_in'),
            'image.image' => __('groups_validation_image_file'),
            'image.mimes' => __('groups_validation_image_mimes'),
            'image.max' => __('groups_validation_image_max'),
        ];
    }
}
