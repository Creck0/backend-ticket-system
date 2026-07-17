<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // endpoint publik
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', 'regex:/^[\pL\s\-\.\']+$/u'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            // OWASP A02 - kebijakan password kuat, cek terhadap daftar password bocor (uncompromised)
            'password' => ['required', 'confirmed', Password::min(10)
                ->letters()->mixedCase()->numbers()->symbols()],
            'phone' => ['nullable', 'string', 'max:16', 'regex:/^\+?[0-9]{8,15}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.uncompromised' => 'Password ini pernah bocor di database publik, silakan gunakan password lain.',
        ];
    }
}
