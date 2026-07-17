<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // hanya admin yang boleh membuat destinasi (dicek juga oleh middleware role)
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'location' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string', 'max:5000'],
            'quota_per_day' => ['required', 'integer', 'min:1', 'max:100000'],
            // upload gambar: validasi tipe MIME asli + ukuran, bukan cuma ekstensi (cegah upload shell)
            'image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'ticket_types' => ['required', 'array', 'min:1'],
            'ticket_types.*.name' => ['required', 'string', 'max:100'],
            'ticket_types.*.price' => ['required', 'numeric', 'min:0', 'max:999999999'],
            'ticket_types.*.stock' => ['required', 'integer', 'min:0'],
        ];
    }
}
