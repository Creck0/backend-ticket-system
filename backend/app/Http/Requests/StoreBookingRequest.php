<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // otorisasi lanjut dicek di controller/policy (user login via Sanctum)
    }

    public function rules(): array
    {
        return [
            'destination_slug' => ['required', 'string', 'exists:destinations,slug'],
            // gunakan format tanggal ketat + tidak boleh tanggal lampau (cegah manipulasi kuota)
            'visit_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.ticket_type_id' => ['required', 'integer', 'exists:ticket_types,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
        ];
    }
}
