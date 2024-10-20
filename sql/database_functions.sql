-- Function to create the todos table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_todos_table()
RETURNS text AS $$
BEGIN
    -- Check if the table already exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'todos') THEN
        -- Create the todos table
        CREATE TABLE public.todos (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            is_complete BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        RETURN 'Todos table created successfully.';
    ELSE
        RETURN 'Todos table already exists.';
    END IF;
END;
$$ LANGUAGE plpgsql;
