package sqlstore

import (
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/jmoiron/sqlx"
	"github.com/mattermost/mattermost-plugin-incident-collaboration/server/incident"
	mock_sqlstore "github.com/mattermost/mattermost-plugin-incident-collaboration/server/sqlstore/mocks"
	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupStatsStore(t *testing.T, db *sqlx.DB) *StatsStore {
	mockCtrl := gomock.NewController(t)

	kvAPI := mock_sqlstore.NewMockKVAPI(mockCtrl)
	configAPI := mock_sqlstore.NewMockConfigurationAPI(mockCtrl)
	pluginAPIClient := PluginAPIClient{
		KV:            kvAPI,
		Configuration: configAPI,
	}

	logger, sqlStore := setupSQLStore(t, db)

	return NewStatsStore(pluginAPIClient, logger, sqlStore)
}

func TestTotalReportedIncidents(t *testing.T) {
	team1id := model.NewId()
	team2id := model.NewId()

	bob := userInfo{
		ID:   model.NewId(),
		Name: "bob",
	}

	lucy := userInfo{
		ID:   model.NewId(),
		Name: "Lucy",
	}

	john := userInfo{
		ID:   model.NewId(),
		Name: "john",
	}

	jane := userInfo{
		ID:   model.NewId(),
		Name: "jane",
	}

	phil := userInfo{
		ID:   model.NewId(),
		Name: "phil",
	}

	quincy := userInfo{
		ID:   model.NewId(),
		Name: "quincy",
	}

	notInvolved := userInfo{
		ID:   model.NewId(),
		Name: "notinvolved",
	}

	channel01 := model.Channel{Id: model.NewId(), Type: "O", CreateAt: 123, DeleteAt: 0}
	channel02 := model.Channel{Id: model.NewId(), Type: "O", CreateAt: 199, DeleteAt: 0}
	channel03 := model.Channel{Id: model.NewId(), Type: "O", CreateAt: 222, DeleteAt: 0}
	channel04 := model.Channel{Id: model.NewId(), Type: "P", CreateAt: 333, DeleteAt: 0}
	channel05 := model.Channel{Id: model.NewId(), Type: "P", CreateAt: 333, DeleteAt: 0}
	channel06 := model.Channel{Id: model.NewId(), Type: "P", CreateAt: 333, DeleteAt: 0}
	channel07 := model.Channel{Id: model.NewId(), Type: "P", CreateAt: 333, DeleteAt: 0}
	channel08 := model.Channel{Id: model.NewId(), Type: "P", CreateAt: 333, DeleteAt: 0}
	channel09 := model.Channel{Id: model.NewId(), Type: "P", CreateAt: 333, DeleteAt: 0}

	for _, driverName := range driverNames {
		db := setupTestDB(t, driverName)
		incidentStore := setupIncidentStore(t, db)
		statsStore := setupStatsStore(t, db)

		_, store := setupSQLStore(t, db)
		setupUsersTable(t, db)
		setupTeamMembersTable(t, db)
		setupChannelMembersTable(t, db)
		setupChannelsTable(t, db)

		addUsers(t, store, []userInfo{lucy, bob, john, jane, notInvolved, phil, quincy})
		addUsersToTeam(t, store, []userInfo{lucy, bob, john, jane, notInvolved, phil, quincy}, team1id)
		addUsersToTeam(t, store, []userInfo{lucy, bob, john, jane, notInvolved, phil, quincy}, team2id)
		createChannels(t, store, []model.Channel{channel01, channel02, channel03, channel04, channel05, channel06, channel07, channel08, channel09})
		addUsersToChannels(t, store, []userInfo{bob, lucy, phil}, []string{channel01.Id, channel02.Id, channel03.Id, channel04.Id, channel06.Id, channel07.Id, channel08.Id, channel09.Id})
		addUsersToChannels(t, store, []userInfo{bob, quincy}, []string{channel05.Id})
		addUsersToChannels(t, store, []userInfo{john}, []string{channel01.Id})
		addUsersToChannels(t, store, []userInfo{jane}, []string{channel01.Id, channel02.Id})
		makeAdmin(t, store, bob)

		inc01 := *NewBuilder(nil).
			WithName("incident 1 - wheel cat aliens wheelbarrow").
			WithChannel(&channel01).
			WithTeamID(team1id).
			WithCurrentStatus("Reported").
			WithCreateAt(123).
			WithPlaybookID("playbook1").
			ToIncident()

		inc02 := *NewBuilder(nil).
			WithName("incident 2").
			WithChannel(&channel02).
			WithTeamID(team1id).
			WithCurrentStatus("Active").
			WithCreateAt(123).
			WithPlaybookID("playbook1").
			ToIncident()

		inc03 := *NewBuilder(nil).
			WithName("incident 3").
			WithChannel(&channel03).
			WithTeamID(team1id).
			WithCurrentStatus("Active").
			WithPlaybookID("playbook2").
			WithCreateAt(123).
			ToIncident()

		inc04 := *NewBuilder(nil).
			WithName("incident 4").
			WithChannel(&channel04).
			WithTeamID(team2id).
			WithCurrentStatus("Reported").
			WithPlaybookID("playbook1").
			WithCreateAt(123).
			ToIncident()

		inc05 := *NewBuilder(nil).
			WithName("incident 5").
			WithChannel(&channel05).
			WithTeamID(team2id).
			WithCurrentStatus("Active").
			WithPlaybookID("playbook2").
			WithCreateAt(123).
			ToIncident()

		inc06 := *NewBuilder(nil).
			WithName("incident 6").
			WithChannel(&channel06).
			WithTeamID(team1id).
			WithCurrentStatus("Resolved").
			WithPlaybookID("playbook1").
			WithCreateAt(123).
			ToIncident()

		inc07 := *NewBuilder(nil).
			WithName("incident 7").
			WithChannel(&channel07).
			WithTeamID(team2id).
			WithCurrentStatus("Resolved").
			WithPlaybookID("playbook2").
			WithCreateAt(123).
			ToIncident()

		inc08 := *NewBuilder(nil).
			WithName("incident 8").
			WithChannel(&channel08).
			WithTeamID(team1id).
			WithCurrentStatus("Archived").
			WithPlaybookID("playbook1").
			WithCreateAt(123).
			ToIncident()

		inc09 := *NewBuilder(nil).
			WithName("incident 9").
			WithChannel(&channel09).
			WithTeamID(team2id).
			WithCurrentStatus("Archived").
			WithPlaybookID("playbook2").
			WithCreateAt(123).
			ToIncident()

		incidents := []incident.Incident{inc01, inc02, inc03, inc04, inc05, inc06, inc07, inc08, inc09}

		for i := range incidents {
			_, err := incidentStore.CreateIncident(&incidents[i])
			require.NoError(t, err)
		}

		t.Run(driverName+" Reported Incidents - team1", func(t *testing.T) {
			result := statsStore.TotalReportedIncidents(&StatsFilters{
				TeamID: team1id,
			})
			assert.Equal(t, 1, result)
		})

		t.Run(driverName+" Reported Incidents - team2", func(t *testing.T) {
			result := statsStore.TotalReportedIncidents(&StatsFilters{
				TeamID: team2id,
			})
			assert.Equal(t, 1, result)
		})

		t.Run(driverName+" Reported incidents - playbook1", func(t *testing.T) {
			result := statsStore.TotalReportedIncidents(&StatsFilters{
				PlaybookID: "playbook1",
			})
			assert.Equal(t, 2, result)
		})

		t.Run(driverName+" Reported incidents - playbook2", func(t *testing.T) {
			result := statsStore.TotalReportedIncidents(&StatsFilters{
				PlaybookID: "playbook2",
			})
			assert.Equal(t, 0, result)
		})

		t.Run(driverName+" Reported incidents - all", func(t *testing.T) {
			result := statsStore.TotalReportedIncidents(&StatsFilters{})
			assert.Equal(t, 2, result)
		})

		t.Run(driverName+" Active Incidents - team1", func(t *testing.T) {
			result := statsStore.TotalActiveIncidents(&StatsFilters{
				TeamID: team1id,
			})
			assert.Equal(t, 2, result)
		})

		t.Run(driverName+" Active Incidents - team2", func(t *testing.T) {
			result := statsStore.TotalActiveIncidents(&StatsFilters{
				TeamID: team2id,
			})
			assert.Equal(t, 1, result)
		})

		t.Run(driverName+" Active incidents - playbook1", func(t *testing.T) {
			result := statsStore.TotalActiveIncidents(&StatsFilters{
				PlaybookID: "playbook1",
			})
			assert.Equal(t, 1, result)
		})

		t.Run(driverName+" Active incidents - playbook2", func(t *testing.T) {
			result := statsStore.TotalActiveIncidents(&StatsFilters{
				PlaybookID: "playbook2",
			})
			assert.Equal(t, 2, result)
		})

		t.Run(driverName+" Active incidents - all", func(t *testing.T) {
			result := statsStore.TotalActiveIncidents(&StatsFilters{})
			assert.Equal(t, 3, result)
		})

		t.Run(driverName+" Active Participants - team1", func(t *testing.T) {
			result := statsStore.TotalActiveParticipants(&StatsFilters{
				TeamID: team1id,
			})
			assert.Equal(t, 5, result)
		})

		t.Run(driverName+" Active Participants - team2", func(t *testing.T) {
			result := statsStore.TotalActiveParticipants(&StatsFilters{
				TeamID: team2id,
			})
			assert.Equal(t, 4, result)
		})

		t.Run(driverName+" Active Participants, playbook1", func(t *testing.T) {
			result := statsStore.TotalActiveParticipants(&StatsFilters{
				PlaybookID: "playbook1",
			})
			assert.Equal(t, 5, result)
		})

		t.Run(driverName+" Active Participants, playbook2", func(t *testing.T) {
			result := statsStore.TotalActiveParticipants(&StatsFilters{
				PlaybookID: "playbook2",
			})
			assert.Equal(t, 4, result)
		})

		t.Run(driverName+" Active Participants, all", func(t *testing.T) {
			result := statsStore.TotalActiveParticipants(&StatsFilters{})
			assert.Equal(t, 6, result)
		})

		t.Run(driverName+" In-progress Incidents - team1", func(t *testing.T) {
			result := statsStore.TotalInProgressIncidents(&StatsFilters{
				TeamID: team1id,
			})
			assert.Equal(t, 3, result)
		})

		t.Run(driverName+" In-progress Incidents - team2", func(t *testing.T) {
			result := statsStore.TotalInProgressIncidents(&StatsFilters{
				TeamID: team2id,
			})
			assert.Equal(t, 2, result)
		})

		t.Run(driverName+" In-progress Incidents - playbook1", func(t *testing.T) {
			result := statsStore.TotalInProgressIncidents(&StatsFilters{
				PlaybookID: "playbook1",
			})
			assert.Equal(t, 3, result)
		})

		t.Run(driverName+" In-progress Incidents - playbook2", func(t *testing.T) {
			result := statsStore.TotalInProgressIncidents(&StatsFilters{
				PlaybookID: "playbook2",
			})
			assert.Equal(t, 2, result)
		})

		t.Run(driverName+" In-progress Incidents - all", func(t *testing.T) {
			result := statsStore.TotalInProgressIncidents(&StatsFilters{})
			assert.Equal(t, 5, result)
		})

		/* This can't be tested well because it uses model.GetMillis() inside
		t.Run(driverName+" Average Druation Active Incidents Minutes", func(t *testing.T) {
			result := statsStore.AverageDurationActiveIncidentsMinutes()
			assert.Equal(t, 26912080, result)
		})*/
	}
}
