<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    // OWASP A01 Broken Access Control: RBAC eksplisit di server, bukan cuma disembunyikan di UI
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user() || ! $request->user()->isAdmin()) {
            abort(403, 'Akses ditolak. Halaman ini khusus admin.');
        }

        return $next($request);
    }
}
