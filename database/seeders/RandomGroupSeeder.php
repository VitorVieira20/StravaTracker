<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RandomGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = range(4, 13);

        $numberOfGroups = rand(4, 10);

        $this->command->info("Creating {$numberOfGroups} random groups ...");

        for ($i = 1; $i <= $numberOfGroups; $i++) {

            $ownerId = $userIds[array_rand($userIds)];

            $group = Group::create([
                'name' => "Grupo Público #{$i} - " . $this->generateRandomAdjective(),
                'description' => "Este é um grupo gerado automaticamente para testes. Juntem-se a nós para correr!",
                'privacy' => 'public',
                'owner_id' => $ownerId,
                'image_path' => null,
            ]);

            $group->users()->attach($ownerId, ['role' => 'admin', 'status' => 'active']);

            $potentialMembers = array_diff($userIds, [$ownerId]);
            $numberOfMembers = rand(2, 8);

            $randomMemberKeys = array_rand($potentialMembers, $numberOfMembers);

            if (!is_array($randomMemberKeys)) {
                $randomMemberKeys = [$randomMemberKeys];
            }

            foreach ($randomMemberKeys as $key) {
                $memberId = $potentialMembers[$key];

                $group->users()->attach($memberId, [
                    'role' => 'member',
                    'status' => 'active'
                ]);
            }
        }

        $this->command->info("✅ {$numberOfGroups} groups created with success with random members!");
    }

    private function generateRandomAdjective()
    {
        $adjectives = ['Velozes', 'Furiosos', 'Domingueiros', 'Trilheiros', 'Maratonistas', 'Iniciantes', 'Hardcore', 'Noturnos'];
        return $adjectives[array_rand($adjectives)];
    }
}
