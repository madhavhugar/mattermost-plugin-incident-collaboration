// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export interface Stats {
    total_reported_incidents: number
    total_active_incidents: number
    total_active_participants: number
    average_duration_active_incidents_minutes: number
    active_incidents: number[]
    people_in_incidents: number[]
    average_start_to_active: number[]
    average_start_to_resolved: number[]
}

export interface PlaybookStats {
    runs_in_progress: number
    participants_active: number
    runs_finished_prev_30_days: number
    runs_finished_percentage_change: number
    runs_started_per_week: number[]
    runs_started_per_week_labels: string[]
    active_runs_per_day: number[]
    active_runs_per_day_labels: string[]
    active_participants_per_day: number[]
    active_participants_per_day_labels: string[]
}

export const EmptyPlaybookStats = {
    runs_in_progress: 0,
    participants_active: 0,
    runs_finished_prev_30_days: 0,
    runs_finished_percentage_change: 0,
    runs_started_per_week: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    runs_started_per_week_labels: ['', '', '', '', '', '', '', '', '', '', '', ''],
    active_runs_per_day: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    active_runs_per_day_labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    active_participants_per_day: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    active_participants_per_day_labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
};
