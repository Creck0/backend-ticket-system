<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->append(SecurityHeaders::class);

        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
        ]);

        $middleware->throttleApi('60,1');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(
            fn ($request) => $request->is('api/*'),
        );

        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->is('api/*') && ! config('app.debug')) {
                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                return response()->json([
                    'message' => $status === 500 ? 'Terjadi kesalahan pada server.' : $e->getMessage(),
                ], $status);
            }
        });
    })->create();
