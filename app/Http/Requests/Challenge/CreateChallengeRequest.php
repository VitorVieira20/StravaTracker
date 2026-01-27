<?php

namespace App\Http\Requests\Challenge;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CreateChallengeRequest extends FormRequest
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
            'type' => 'required|in:total_distance,total_time,max_distance,max_elevation,most_activities',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ];
    }


    public function messages(): array
    {
        return [
            'name.required' => __('challenges_validation_name_required'),
            'name.string' => __('challenges_validation_name_string'),
            'name.max' => __('challenges_validation_name_max'),
            'type.required' => __('challenges_validation_type_required'),
            'type.in' => __('challenges_validation_type_in'),
            'start_date.required' => __('challenges_validation_start_date_required'),
            'start_date.date' => __('challenges_validation_start_date_date'),
            'end_date.required' => __('challenges_validation_end_date_required'),
            'end_date.date' => __('challenges_validation_end_date_date'),
            'end_date.after_or_equal' => __('challenges_validation_end_date_after_or_equal'),
        ];
    }
}
