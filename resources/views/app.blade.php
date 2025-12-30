<!DOCTYPE html>
<html lang="pt-PT">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="Vitor Vieira Web Developer">

    <link rel="icon" type="image/png" href="{{ asset('logo.png') }}" />

    <meta name="theme-color" content="#ffffff">
    <link rel="preload" as="style"
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap">

    <link rel="canonical" href="{{ url()->current() }}" />
    <link rel="preload" as="style"
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap">
    <link rel="canonical" href="{{ url()->current() }}" />
    <link rel="preload" as="style"
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap">

    <title>Strava Tracker</title>

    @viteReactRefresh
    @routes
    @if (app()->environment('local') || app()->environment('production'))
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx", "resources/css/app.css"])
    @endif
    @inertiaHead

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet">
    <style>
        * {
            font-family: "Poppins", sans-serif;
        }
    </style>
</head>

<body>
    @inertia
</body>

</html>