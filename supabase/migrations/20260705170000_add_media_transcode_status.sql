-- Add transcode_status column to media table for tracking server-side transcodes
ALTER TABLE public.media
  ADD COLUMN transcode_status TEXT;

-- Restrict values to known states or null
ALTER TABLE public.media ADD CONSTRAINT media_transcode_status_check CHECK (
  transcode_status IN ('pending','processing','done','failed') OR transcode_status IS NULL
);

-- Optionally, you can initialize existing rows to 'done' if you consider them already processed.
-- UPDATE public.media SET transcode_status = 'done' WHERE transcode_status IS NULL;
