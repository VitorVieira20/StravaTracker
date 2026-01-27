<?php

namespace App\Http\Controllers;

use App\Http\Requests\Group\CreateGroupRequest;
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


    public function index()
    {
        $user = Auth::user();

        $myGroups = $this->groupService->userGroups($user);
        $pendingGroups = $this->groupService->userPendingGroups($user);
        $suggestedGroups = $this->groupService->suggestedGroups($user);

        return Inertia::render('Groups/Index', [
            'myGroups' => $myGroups,
            'pendingGroups' => $pendingGroups,
            'suggestedGroups' => $suggestedGroups,
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
        $currentUserPivot = $group->users()
            ->where('user_id', Auth::id())
            ->first()
                ?->pivot;

        return Inertia::render('Groups/Show', [
            'group' => $group->load('users'),
            'challenges' => $activeChallenges,
            'membership' => [
                'is_member' => $currentUserPivot && $currentUserPivot->status === 'active',
                'is_pending' => $currentUserPivot && $currentUserPivot->status === 'pending',
                'is_admin' => $currentUserPivot && $currentUserPivot->role === 'admin',
            ],
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


    public function leave(Request $request, Group $group)
    {
        // Validar opcionalmente o new_admin_id
        $request->validate([
            'new_admin_id' => 'nullable|exists:users,id'
        ]);

        $newAdminId = $request->input('new_admin_id');

        $result = $this->groupService->leaveGroup($group, Auth::user(), $newAdminId);

        // Se o grupo foi eliminado ou saiu com sucesso
        if ($result['type'] === 'success') {
            return redirect()->route('groups.index')->with('success', $result['message']);
        }

        // Se houve erro (ex: precisa de sucessor)
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
}
