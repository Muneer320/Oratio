#!/usr/bin/env python3
"""
Data migration script: ReplitDB → PostgreSQL
Transfers all existing data from ReplitDB to PostgreSQL while maintaining relationships.
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import (
    User, Room, Participant, Turn, SpectatorVote,
    Result, TrainerFeedback, UploadedFile
)
from app.replit_db import ReplitDB, Collections


class DataMigrator:
    """Handles migration of data from ReplitDB to PostgreSQL"""

    def __init__(self):
        self.id_mappings = {
            'users': {},
            'rooms': {},
            'participants': {},
            'turns': {},
            'spectator_votes': {},
            'results': {},
            'trainer_feedback': {},
            'uploaded_files': {},
        }
        self.stats = {
            'users': 0,
            'rooms': 0,
            'participants': 0,
            'turns': 0,
            'spectator_votes': 0,
            'results': 0,
            'trainer_feedback': 0,
            'uploaded_files': 0,
        }

    async def migrate_all(self):
        """Run complete migration"""
        print("=" * 60)
        print("🚀 Starting data migration: ReplitDB → PostgreSQL")
        print("=" * 60)

        async with AsyncSessionLocal() as db:
            try:
                # Migration order matters due to foreign key constraints
                await self.migrate_users(db)
                await self.migrate_rooms(db)
                await self.migrate_participants(db)
                await self.migrate_turns(db)
                await self.migrate_spectator_votes(db)
                await self.migrate_results(db)
                await self.migrate_trainer_feedback(db)
                await self.migrate_uploaded_files(db)

                await db.commit()

                print("\n" + "=" * 60)
                print("✅ Migration completed successfully!")
                print("=" * 60)
                print("\n📊 Migration Statistics:")
                for collection, count in self.stats.items():
                    print(f"   {collection}: {count} records migrated")
                print("=" * 60)

            except Exception as e:
                await db.rollback()
                print(f"\n❌ Migration failed: {e}")
                raise

    async def migrate_users(self, db: AsyncSession):
        """Migrate users collection"""
        print("\n📋 Migrating users...")
        users = ReplitDB.find(Collections.USERS, limit=10000)

        for old_user in users:
            new_user = User(
                email=old_user.get('email', ''),
                username=old_user.get('username', ''),
                hashed_password=old_user.get('hashed_password', ''),
                full_name=old_user.get('full_name'),
                avatar_url=old_user.get('avatar_url'),
                bio=old_user.get('bio'),
                xp=old_user.get('xp', 0),
                badges=old_user.get('badges', []),
            )

            db.add(new_user)
            await db.flush()

            # Map old ID to new ID
            self.id_mappings['users'][old_user['id']] = new_user.id
            self.stats['users'] += 1

        print(f"   ✅ Migrated {self.stats['users']} users")

    async def migrate_rooms(self, db: AsyncSession):
        """Migrate rooms collection"""
        print("\n📋 Migrating rooms...")
        rooms = ReplitDB.find(Collections.ROOMS, limit=10000)

        for old_room in rooms:
            # Map old host_id to new user id
            host_id = self.id_mappings['users'].get(old_room.get('host_id'))
            if not host_id:
                print(f"   ⚠️  Skipping room {old_room['id']} - host not found")
                continue

            new_room = Room(
                topic=old_room.get('topic', ''),
                description=old_room.get('description'),
                scheduled_time=old_room.get('scheduled_time'),
                duration_minutes=old_room.get('duration_minutes', 30),
                mode=old_room.get('mode', 'text'),
                type=old_room.get('type', 'individual'),
                visibility=old_room.get('visibility', 'public'),
                rounds=old_room.get('rounds', 3),
                status=old_room.get('status', 'upcoming'),
                host_id=host_id,
                resources=old_room.get('resources', []),
                room_code=old_room.get('room_code', ''),
            )

            db.add(new_room)
            await db.flush()

            self.id_mappings['rooms'][old_room['id']] = new_room.id
            self.stats['rooms'] += 1

        print(f"   ✅ Migrated {self.stats['rooms']} rooms")

    async def migrate_participants(self, db: AsyncSession):
        """Migrate participants collection"""
        print("\n📋 Migrating participants...")
        participants = ReplitDB.find(Collections.PARTICIPANTS, limit=10000)

        for old_participant in participants:
            # Map old IDs to new IDs
            user_id = self.id_mappings['users'].get(old_participant.get('user_id'))
            room_id = self.id_mappings['rooms'].get(old_participant.get('room_id'))

            if not user_id or not room_id:
                print(f"   ⚠️  Skipping participant {old_participant['id']} - user or room not found")
                continue

            new_participant = Participant(
                user_id=user_id,
                room_id=room_id,
                team=old_participant.get('team'),
                role=old_participant.get('role', 'debater'),
                is_ready=old_participant.get('is_ready', False),
                score=old_participant.get('score', {}),
                xp_earned=old_participant.get('xp_earned', 0),
            )

            db.add(new_participant)
            await db.flush()

            self.id_mappings['participants'][old_participant['id']] = new_participant.id
            self.stats['participants'] += 1

        print(f"   ✅ Migrated {self.stats['participants']} participants")

    async def migrate_turns(self, db: AsyncSession):
        """Migrate turns collection"""
        print("\n📋 Migrating turns...")
        turns = ReplitDB.find(Collections.TURNS, limit=10000)

        for old_turn in turns:
            # Map old IDs to new IDs
            room_id = self.id_mappings['rooms'].get(old_turn.get('room_id'))
            speaker_id = self.id_mappings['participants'].get(old_turn.get('speaker_id'))

            if not room_id or not speaker_id:
                print(f"   ⚠️  Skipping turn {old_turn['id']} - room or speaker not found")
                continue

            new_turn = Turn(
                room_id=room_id,
                speaker_id=speaker_id,
                content=old_turn.get('content', ''),
                audio_url=old_turn.get('audio_url'),
                round_number=old_turn.get('round_number', 1),
                turn_number=old_turn.get('turn_number', 1),
                ai_feedback=old_turn.get('ai_feedback', {}),
            )

            db.add(new_turn)
            await db.flush()

            self.id_mappings['turns'][old_turn['id']] = new_turn.id
            self.stats['turns'] += 1

        print(f"   ✅ Migrated {self.stats['turns']} turns")

    async def migrate_spectator_votes(self, db: AsyncSession):
        """Migrate spectator votes collection"""
        print("\n📋 Migrating spectator votes...")
        votes = ReplitDB.find(Collections.SPECTATOR_VOTES, limit=10000)

        for old_vote in votes:
            # Map old IDs to new IDs
            room_id = self.id_mappings['rooms'].get(old_vote.get('room_id'))
            spectator_id = self.id_mappings['users'].get(old_vote.get('spectator_id'))
            target_id = self.id_mappings['participants'].get(old_vote.get('target_id'))

            if not room_id or not spectator_id or not target_id:
                print(f"   ⚠️  Skipping vote {old_vote['id']} - room, spectator, or target not found")
                continue

            new_vote = SpectatorVote(
                room_id=room_id,
                spectator_id=spectator_id,
                target_id=target_id,
                reaction_type=old_vote.get('reaction_type', '👏'),
            )

            db.add(new_vote)
            await db.flush()

            self.id_mappings['spectator_votes'][old_vote['id']] = new_vote.id
            self.stats['spectator_votes'] += 1

        print(f"   ✅ Migrated {self.stats['spectator_votes']} spectator votes")

    async def migrate_results(self, db: AsyncSession):
        """Migrate results collection"""
        print("\n📋 Migrating results...")
        results = ReplitDB.find(Collections.RESULTS, limit=10000)

        for old_result in results:
            # Map old IDs to new IDs
            room_id = self.id_mappings['rooms'].get(old_result.get('room_id'))
            winner_id = None
            if old_result.get('winner_id'):
                winner_id = self.id_mappings['participants'].get(old_result.get('winner_id'))

            if not room_id:
                print(f"   ⚠️  Skipping result {old_result['id']} - room not found")
                continue

            new_result = Result(
                room_id=room_id,
                winner_id=winner_id,
                scores_json=old_result.get('scores_json', {}),
                feedback_json=old_result.get('feedback_json', {}),
                summary=old_result.get('summary', ''),
                report_url=old_result.get('report_url'),
                spectator_influence=old_result.get('spectator_influence', {}),
            )

            db.add(new_result)
            await db.flush()

            self.id_mappings['results'][old_result['id']] = new_result.id
            self.stats['results'] += 1

        print(f"   ✅ Migrated {self.stats['results']} results")

    async def migrate_trainer_feedback(self, db: AsyncSession):
        """Migrate trainer feedback collection"""
        print("\n📋 Migrating trainer feedback...")
        feedback = ReplitDB.find(Collections.TRAINER_FEEDBACK, limit=10000)

        for old_feedback in feedback:
            # Map old user_id to new user id
            user_id = self.id_mappings['users'].get(old_feedback.get('user_id'))
            if not user_id:
                print(f"   ⚠️  Skipping feedback {old_feedback['id']} - user not found")
                continue

            new_feedback = TrainerFeedback(
                user_id=user_id,
                metrics_json=old_feedback.get('metrics_json', {}),
                recommendations=old_feedback.get('recommendations', []),
                xp=old_feedback.get('xp', 0),
                badges=old_feedback.get('badges', []),
            )

            db.add(new_feedback)
            await db.flush()

            self.id_mappings['trainer_feedback'][old_feedback['id']] = new_feedback.id
            self.stats['trainer_feedback'] += 1

        print(f"   ✅ Migrated {self.stats['trainer_feedback']} trainer feedback")

    async def migrate_uploaded_files(self, db: AsyncSession):
        """Migrate uploaded files collection"""
        print("\n📋 Migrating uploaded files...")
        files = ReplitDB.find(Collections.UPLOADED_FILES, limit=10000)

        for old_file in files:
            # Map old room_id to new room id
            room_id = self.id_mappings['rooms'].get(old_file.get('room_id'))
            if not room_id:
                print(f"   ⚠️  Skipping file {old_file['id']} - room not found")
                continue

            new_file = UploadedFile(
                room_id=room_id,
                file_name=old_file.get('file_name', ''),
                file_path=old_file.get('file_path', ''),
                file_type=old_file.get('file_type', ''),
                file_size=old_file.get('file_size'),
            )

            db.add(new_file)
            await db.flush()

            self.id_mappings['uploaded_files'][old_file['id']] = new_file.id
            self.stats['uploaded_files'] += 1

        print(f"   ✅ Migrated {self.stats['uploaded_files']} uploaded files")


async def main():
    """Main migration entry point"""
    migrator = DataMigrator()
    await migrator.migrate_all()


if __name__ == "__main__":
    asyncio.run(main())
