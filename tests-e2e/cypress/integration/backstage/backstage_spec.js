// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// ***************************************************************

describe('backstage', () => {
    const playbookName = 'Playbook (' + Date.now() + ')';

    before(() => {
        // # Login as user-1
        cy.apiLogin('user-1');

        // # Create a playbook and start an incident.
        cy.apiGetTeamByName('ad-1').then((team) => {
            cy.apiGetCurrentUser().then((user) => {
                cy.apiCreateTestPlaybook({
                    teamId: team.id,
                    title: playbookName,
                    userId: user.id,
                }).then((playbook) => {
                    const now = Date.now();
                    const incidentName = 'Incident (' + now + ')';
                    cy.apiStartIncident({
                        teamId: team.id,
                        playbookId: playbook.id,
                        incidentName,
                        ownerUserId: user.id,
                    });
                });
            });
        });
    });

    beforeEach(() => {
        // # Login as user-1
        cy.apiLogin('user-1');

        // # Navigate to the application
        cy.visit('/ad-1/');
    });

    // it('opens statistics view by default', () => {
    //     // # Open the backstage
    //     cy.visit('/ad-1/com.mattermost.plugin-incident-management/stats');

    //     // * Verify that when backstage loads, the heading is visible and contains "Statistics"
    //     cy.findByTestId('titleStats').should('exist').contains('Statistics');
    // });

    it('switches to playbooks list view via header button', () => {
        // # Open backstage
        cy.visit('/ad-1/com.mattermost.plugin-incident-management');

        // # Switch to playbooks backstage
        cy.findByTestId('playbooksLHSButton').click();

        // * Verify that playbooks are shown
        cy.findByTestId('titlePlaybook').should('exist').contains('Playbooks');
    });

    it('switches to incidents list view via header button', () => {
        // # Open backstage
        cy.visit('/ad-1/com.mattermost.plugin-incident-management');

        // # Switch to playbooks backstage
        cy.findByTestId('playbooksLHSButton').click();

        // # Switch to incidents backstage
        cy.findByTestId('incidentsLHSButton').click();

        // * Verify that incidents are shown
        cy.findByTestId('titleIncident').should('exist').contains('Incidents');
    });
});
