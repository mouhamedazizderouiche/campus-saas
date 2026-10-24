# Database design

This document is a proposed PostgreSQL model, not an applied schema. There is no migration or live Supabase project. UUIDs are used for application entities; `profiles.id` is the Supabase Auth user UUID. Use `timestamptz` for event times and database-generated timestamps. Names below are illustrative snake_case table/column names.

## Entities and relationships

| Entity | Proposed columns and relationships |
| --- | --- |
| `schools` | `id` UUID primary key, `name`, unique stable `slug`, `created_at`. A school owns many profiles. |
| `profiles` | `id` UUID primary key and FK to `auth.users(id)` with deletion behavior decided alongside account deletion; `school_id` FK to `schools`; display name, biography, interests, visibility state, timestamps. A student belongs to exactly one school in the MVP. |
| `likes` | `id` UUID PK; `school_id`; `actor_id` and `target_id` FKs to profiles; creation time. Each row is one directional like. A pass need not be persisted until product requirements decide whether history is needed. |
| `matches` | `id` UUID PK; `school_id`; canonical `user_low_id`, `user_high_id` FKs to profiles; created/ended timestamps and status. One row represents one mutual match, regardless of which user liked first. |
| `conversations` | `id` UUID PK; `match_id` FK to matches and unique; created time. The MVP has one private conversation per match. |
| `conversation_members` | `conversation_id` and `user_id` FKs, composite PK; joined/left timestamps if membership history is required. The only permitted members are the two match participants. |
| `messages` | `id` UUID PK; `conversation_id` and `sender_id` FKs; body, created time, optional `deleted_at` for a defined deletion policy. |
| `blocks` | `id` UUID PK; `blocker_id` and `blocked_id` FKs to profiles; created time. A block is directional and immediately suppresses discovery and communication in either direction. |
| `reports` | `id` UUID PK; `reporter_id` FK; nullable reported profile, message, or match/conversation references as appropriate; reason/category, private details, status, created time. Keep report access restricted to the reporter and explicitly authorized moderation roles. |

## Constraints and indexes

- `schools.slug` is unique. `profiles.school_id` is non-null for an active discoverable profile; use a composite unique key `(id, school_id)` if enforcing school consistency through composite foreign keys.
- `likes` has `CHECK (actor_id <> target_id)` and `UNIQUE (actor_id, target_id)`. Add `(school_id, target_id, actor_id)` for reciprocal-like lookup and `(school_id, actor_id, created_at DESC)` for outgoing history. A trigger or trusted transaction must ensure both profiles share `school_id` and are not blocked.
- Canonicalize match participants so `user_low_id < user_high_id`; enforce `CHECK (user_low_id < user_high_id)` and `UNIQUE (user_low_id, user_high_id)`. A reciprocal-like transaction should create or return the single canonical match atomically. Add `(school_id, user_low_id)` and `(school_id, user_high_id)` indexes for participant lookups. If ended matches can be recreated, decide whether uniqueness applies across all history or only active rows before implementation.
- `conversations.match_id` is unique. `conversation_members` uses `PRIMARY KEY (conversation_id, user_id)` and index `(user_id, conversation_id)` for a user's conversation list.
- `messages` index `(conversation_id, created_at DESC, id DESC)` for paginated history. Add sender membership authorization; do not rely on the FK alone.
- `blocks` enforces distinct users and `UNIQUE (blocker_id, blocked_id)`. Index both directions or use an indexed normalized pair for efficient checks that either party blocked the other.
- Add report indexes for moderation queues (for example `(status, created_at DESC)`), scoped so ordinary users cannot enumerate reports.

Foreign keys that preserve moderation evidence may use restricted deletion or carefully designed anonymization rather than cascading away reports. Choose retention and hard-delete semantics before migration. Message deletion, match recreation, school transfer, and profile photo lifecycle need explicit product and privacy decisions.

## Multi-school strategy

Every profile has one `school_id`. Include that tenant key in discovery-oriented records (`likes`, `matches`) and queries to make school scoping explicit. Enforce that related profiles belong to the same school through composite foreign keys or a database function/trigger; application filters alone are insufficient. The initial MVP queries only a student's own school. Cross-school discovery remains disabled until an explicit product setting, authorization rule, and user-facing privacy decision exist.

## Access control and migration plan

Enable RLS on every user-data table. Policies should derive the current principal from `auth.uid()`, not accept a client-provided identity. Profiles need distinct owner-update and minimized discovery-read rules. Likes should be writable only by their actor and readable only as required for the mutual-like transaction. Matches and conversations should be visible only to participants. Conversation members and messages require membership checks; a sender must be a current member of the conversation tied to an active match. Blocks must hide each party from the other's discovery results and deny message access. Reports require reporter-only submission/read behavior plus a narrowly defined moderator role.

When implementation begins, add small ordered migrations: core schools/profiles first, then interactions, then conversations/messages, then blocks/reports and their RLS. Review grants, policy recursion, transaction boundaries, indexes, and deletion behavior before applying each migration. Test policies against owner, other student, blocked student, unrelated student, and moderator identities in a disposable local Supabase environment. Do not ship schema changes without verifying the authorization behavior.
