-- Phase 1: Foundation & Single Gym MVP
-- Database Schema Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gyms table
CREATE TABLE public.gyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    gym_code TEXT NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gym_memberships table
CREATE TABLE public.gym_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'banned')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES public.users(id),
    UNIQUE(gym_id, user_id)
);

-- Create workout_plans table
CREATE TABLE public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL,
    workout_time TIME NOT NULL,
    workout_type TEXT NOT NULL CHECK (workout_type IN ('Chest', 'Back', 'Legs', 'Cardio', 'Full Body')),
    notes TEXT,
    looking_for_partner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_gyms_owner_id ON public.gyms(owner_id);
CREATE INDEX idx_gyms_gym_code ON public.gyms(gym_code);
CREATE INDEX idx_gym_memberships_gym_id ON public.gym_memberships(gym_id);
CREATE INDEX idx_gym_memberships_user_id ON public.gym_memberships(user_id);
CREATE INDEX idx_gym_memberships_gym_user ON public.gym_memberships(gym_id, user_id);
CREATE INDEX idx_workout_plans_gym_id ON public.workout_plans(gym_id);
CREATE INDEX idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX idx_workout_plans_gym_date ON public.workout_plans(gym_id, workout_date);
CREATE INDEX idx_workout_plans_date ON public.workout_plans(workout_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON public.gyms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Gyms policies
CREATE POLICY "Anyone can view gyms" ON public.gyms
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create gyms" ON public.gyms
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Gym owners can update their gyms" ON public.gyms
    FOR UPDATE USING (auth.uid() = owner_id);

-- Gym memberships policies
CREATE POLICY "Users can view memberships in their gyms" ON public.gym_memberships
    FOR SELECT USING (
        user_id = auth.uid() OR
        gym_id IN (
            SELECT gym_id FROM public.gym_memberships
            WHERE user_id = auth.uid() AND status = 'approved'
        )
    );

CREATE POLICY "Users can request to join gyms" ON public.gym_memberships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Gym owners and admins can update memberships" ON public.gym_memberships
    FOR UPDATE USING (
        gym_id IN (
            SELECT gym_id FROM public.gym_memberships
            WHERE user_id = auth.uid()
            AND (role = 'owner' OR role = 'admin')
            AND status = 'approved'
        )
    );

-- Workout plans policies
CREATE POLICY "Members can view workouts in their gyms" ON public.workout_plans
    FOR SELECT USING (
        gym_id IN (
            SELECT gym_id FROM public.gym_memberships
            WHERE user_id = auth.uid() AND status = 'approved'
        )
    );

CREATE POLICY "Approved members can create workouts" ON public.workout_plans
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        gym_id IN (
            SELECT gym_id FROM public.gym_memberships
            WHERE user_id = auth.uid() AND status = 'approved'
        )
    );

CREATE POLICY "Users can update their own workouts" ON public.workout_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" ON public.workout_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically create gym owner membership
CREATE OR REPLACE FUNCTION public.handle_new_gym()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.gym_memberships (gym_id, user_id, role, status, approved_at, approved_by)
    VALUES (NEW.id, NEW.owner_id, 'owner', 'approved', NOW(), NEW.owner_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create gym owner membership on gym creation
CREATE TRIGGER on_gym_created
    AFTER INSERT ON public.gyms
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_gym();
