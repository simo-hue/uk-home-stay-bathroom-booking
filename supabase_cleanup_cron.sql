-- Ensure the pg_cron extension is enabled
create extension if not exists pg_cron;

-- Schedule the cleanup job to run every day at midnight
select cron.schedule(
  'cleanup_old_reservations', -- Name of the cron job
  '0 0 * * *', -- Schedule: Everyday at midnight
  $$ delete from public.reservations where start_time < (now() - interval '3 days') $$
);
