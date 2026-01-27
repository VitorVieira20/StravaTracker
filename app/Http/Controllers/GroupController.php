<?php

namespace App\Http\Controllers;

use App\Http\Requests\Group\CreateGroupRequest;
use App\Models\Group;
use App\Services\ChallengeService;
use App\Services\GroupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function __construct(protected GroupService $groupService)
    {
    }


    public function index()
    {
        $user = Auth::user();

        $myGroups = $this->groupService->userGroups($user);
        $suggestedGroups = $this->groupService->suggestedGroups($user);

        return Inertia::render('Groups/Index', [
            'myGroups' => $myGroups,
            'suggestedGroups' => $suggestedGroups,
        ]);
    }


    public function show(Group $group)
    {
        $activeChallenges = $this->groupService->groupActiveChallenges($group);
        $userCanCreateChallenge = $this->groupService->userCanCreateChallenge(Auth::user(), $group);

        return Inertia::render('Groups/Show', [
            'group' => $group->load('users'),
            'challenges' => $activeChallenges,
            'canCreateChallenge' => $userCanCreateChallenge
        ]);
    }


    public function store(CreateGroupRequest $request)
    {
        $group = $this->groupService->create($request, Auth::id());

        return redirect()->route('groups.show', $group->id)
            ->with('success', __('groups_messages_created_success'));
    }
}
