-- Add ot_time_hrs (float) and day_care_procedures (integer) to revenue table

ALTER TABLE revenue
ADD COLUMN ot_time_hrs float DEFAULT 0;

ALTER TABLE revenue
ADD COLUMN day_care_procedures integer DEFAULT 0;
