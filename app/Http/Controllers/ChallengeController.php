<?php

namespace App\Http\Controllers;

use App\Http\Requests\Challenge\CreateChallengeRequest;
use App\Models\Group;
use App\Services\ChallengeService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChallengeController extends Controller
{
    public function __construct(protected ChallengeService $challengeService)
    {
    }


    public function store(CreateChallengeRequest $request, Group $group)
    {
        try {
            $this->challengeService->create($request, $group, Auth::user());

            return redirect()->route('groups.show', $group->id)
                ->with('success', __('challenges_messages_created_success'));

        } catch (Exception $e) {
            return redirect()->route('groups.index')
                ->with('error', $e->getMessage());
        }
    }
}
