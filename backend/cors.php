<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

    // OWASP A05: JANGAN PERNAH pakai '*' di sini karena kita mengirim cookie kredensial.
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'X-XSRF-TOKEN', 'Accept'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // wajib true untuk Sanctum SPA cookie auth
];
