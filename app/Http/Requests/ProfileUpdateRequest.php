<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $this->user()->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'nin' => ['nullable', 'string', 'max:50'],
            'dob' => ['nullable', 'date'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'address_street' => ['nullable', 'string', 'max:255'],
            'address_city' => ['nullable', 'string', 'max:100'],
            'address_state' => ['nullable', 'string', 'max:100'],
            'address_country' => ['nullable', 'string', 'max:100'],
            'id_type' => ['nullable', 'string', 'max:50'],
            'id_number' => ['nullable', 'string', 'max:100'],
            'id_document' => ['nullable', 'file', 'max:5120', 'mimes:pdf,jpg,jpeg,png,doc,docx'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert empty strings to null for all nullable fields
        $this->merge([
            'phone' => $this->phone !== '' ? $this->phone : null,
            'nin' => $this->nin !== '' ? $this->nin : null,
            'dob' => $this->dob !== '' ? $this->dob : null,
            'nationality' => $this->nationality !== '' ? $this->nationality : null,
            'address_street' => $this->address_street !== '' ? $this->address_street : null,
            'address_city' => $this->address_city !== '' ? $this->address_city : null,
            'address_state' => $this->address_state !== '' ? $this->address_state : null,
            'address_country' => $this->address_country !== '' ? $this->address_country : null,
            'id_type' => $this->id_type !== '' ? $this->id_type : null,
            'id_number' => $this->id_number !== '' ? $this->id_number : null,
        ]);
    }
}