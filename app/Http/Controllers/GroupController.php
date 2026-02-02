<?php

namespace App\Http\Controllers;

use App\Http\Requests\Group\CreateGroupRequest;
use App\Http\Requests\Group\LeaveGroupRequest;
use App\Models\Group;
use App\Models\User;
use App\Services\GroupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function __construct(protected GroupService $groupService)
    {
    }


    public function index(Request $request)
    {
        $user = Auth::user();

        $searchQuery = $request->input('search');
        $filter = $request->input('filter', 'newest');

        $myGroups = $this->groupService->userGroups($user);
        $pendingGroups = $this->groupService->userPendingGroups($user);
        $myInvitations = $this->groupService->getUserInvitations($user);

        if ($request->filled('search') || $request->filled('filter')) {
            $suggestedGroups = $this->groupService->searchGroups($user, $searchQuery ?? '', $filter);
        } else {
            $suggestedGroups = $this->groupService->suggestedGroups($user);
        }

        return Inertia::render('Groups/Index', [
            'myGroups' => $myGroups,
            'pendingGroups' => $pendingGroups,
            'myInvitations' => $myInvitations,
            'suggestedGroups' => $suggestedGroups,
            'filters' => ['search' => $searchQuery, 'filter' => $filter]
        ]);
    }


    public function show(Group $group)
    {
        $group->load([
            'users' => function ($q) {
                $q->orderByPivot('created_at', 'desc');
            }
        ]);

        $activeChallenges = $this->groupService->groupActiveChallenges($group);
        $pastChallenges = $this->groupService->groupPastChallenges($group);

        $hallOfFame = $this->groupService->getHallOfFame($pastChallenges);

        $currentUserPivot = $group->users()
            ->where('user_id', Auth::id())
            ->first()
                ?->pivot;

        $authManagedGroups = [];
        if (Auth::check()) {
            $authManagedGroups = $this->groupService->getUserAdminGroups(Auth::user());
        }

        return Inertia::render('Groups/Show', [
            'group' => $group->load('users'),
            'challenges' => $activeChallenges,
            'pastChallenges' => $pastChallenges,
            'hallOfFame' => $hallOfFame,
            'membership' => [
                'is_member' => $currentUserPivot && $currentUserPivot->status === 'active',
                'is_pending' => $currentUserPivot && $currentUserPivot->status === 'pending',
                'is_admin' => $currentUserPivot && $currentUserPivot->role === 'admin',
            ],
            'authManagedGroups' => $authManagedGroups,
        ]);
    }


    public function store(CreateGroupRequest $request)
    {
        $group = $this->groupService->create($request, Auth::id());

        return redirect()->route('groups.show', $group->id)
            ->with('success', __('groups_messages_created_success'));
    }


    public function join(Group $group)
    {
        $result = $this->groupService->joinGroup($group, Auth::user());
        return back()->with($result['type'], $result['message']);
    }


    public function leave(LeaveGroupRequest $request, Group $group)
    {
        $newAdminId = $request->input('new_admin_id');

        $result = $this->groupService->leaveGroup($group, Auth::user(), $newAdminId);

        if ($result['type'] === 'success') {
            return redirect()->route('groups.index')->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }


    public function approve(Group $group, User $user)
    {
        $this->groupService->approveRequest($group, $user->id);
        return back()->with('success', __('groups_messages_approve_success'));
    }

    public function remove(Group $group, User $user)
    {
        $result = $this->groupService->removeMember($group, $user->id);
        return back()->with($result['type'], $result['message']);
    }


    public function invite(Request $request, Group $group)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id|required_without:email',
        ]);

        $result = $this->groupService->inviteUser(
            $group,
            Auth::user(),
            $request->input('user_id')
        );

        return back()->with($result['type'], $result['message']);
    }


    public function respondInvite(Request $request, $invitationId)
    {
        $accept = $request->boolean('accept');
        $result = $this->groupService->respondInvitation($invitationId, Auth::user(), $accept);
        return back()->with($result['type'], $result['message']);
    }
}
