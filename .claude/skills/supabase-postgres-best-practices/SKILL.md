---
name: supabase-postgres-best-practices
description: "Postgres best practices maintained by Supabase, for Postgres running anywhere. Load this skill BEFORE writing or changing anything that lives in a Postgres database: creating or altering tables and columns (including choosing column types), schema design, migrations and declarative schema files, RLS policies and the tests that verify them, indexes, triggers, database functions, queues and scheduled jobs (pg_cron, pgmq), vector/semantic search (pgvector), and restoring dumps (pg_restore) or importing data. Also load it when diagnosing slow queries, high CPU, timeouts, EXPLAIN plans, connection exhaustion, locking, bloat, or rows visible to the wrong user or tenant. This is not just a performance guide — schema, migration, security, and SQL authoring tasks need these rules too, even for a one-column change or a single query."
---

# Supabase Postgres Best Practices

Comprehensive performance optimization guide for Postgres, maintained by Supabase. Contains rules across 8 categories, prioritized by impact to guide query optimization and schema design.

## When to Apply

Reference these guidelines when:
- Writing SQL queries or designing schemas
- Implementing indexes or query optimization
- Reviewing database performance issues
- Configuring connection pooling or scaling
- Optimizing for Postgres-specific features
- Working with Row-Level Security (RLS)

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Performance | CRITICAL | `query-` |
| 2 | Connection Management | CRITICAL | `conn-` |
| 3 | Security & RLS | CRITICAL | `security-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Concurrency & Locking | MEDIUM-HIGH | `lock-` |
| 6 | Data Access Patterns | MEDIUM | `data-` |
| 7 | Monitoring & Diagnostics | LOW-MEDIUM | `monitor-` |
| 8 | Advanced Features | LOW | `advanced-` |

## How to Use

This SKILL.md is an index only — the full rule explanations, SQL examples, and EXPLAIN output live in per-rule reference files in the upstream repo. Fetch a rule file fresh when you need the detailed explanation for a specific rule, e.g.:

```
https://raw.githubusercontent.com/supabase/agent-skills/main/skills/supabase-postgres-best-practices/references/query-missing-indexes.md
https://raw.githubusercontent.com/supabase/agent-skills/main/skills/supabase-postgres-best-practices/references/_sections.md
```

`_sections.md` is the index of every available reference file — fetch it first if you're not sure of the exact filename for a rule/category you need.

Apply the categories above by priority — critical query-performance and connection-management issues first, advanced features last.

## References

- https://www.postgresql.org/docs/current/
- https://supabase.com/docs
- https://wiki.postgresql.org/wiki/Performance_Optimization
- https://supabase.com/docs/guides/database/overview
- https://supabase.com/docs/guides/auth/row-level-security

## Note for this project

Cultivated Consultation connects to Supabase Postgres over plain JDBC via Spring Data JPA — the connection-management and pooling guidance is directly relevant (we're on the pooler/direct connection, not supabase-js). Schema-design and RLS guidance applies to our dedicated `cultivated_consultation` schema.
