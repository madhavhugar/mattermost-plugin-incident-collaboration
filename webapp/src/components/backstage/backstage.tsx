// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {Switch, Route, NavLink, useRouteMatch, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

import styled from 'styled-components';

import {GlobalState} from 'mattermost-redux/types/store';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {Team} from 'mattermost-redux/types/teams';

import PlaybookList from 'src/components/backstage/playbook_list';
import PlaybookEdit from 'src/components/backstage/playbook_edit';
import BackstageIncidentList from 'src/components/backstage/incidents/incident_list/incident_list';
import {NewPlaybook} from 'src/components/backstage/new_playbook';
import {ErrorPageTypes} from 'src/constants';
import {navigateToUrl, teamPluginErrorUrl} from 'src/browser_routing';
import PlaybookIcon from 'src/components/assets/icons/playbook_icon';
import IncidentIcon from 'src/components/assets/icons/incident_icon';
import IncidentBackstage
    from 'src/components/backstage/incidents/incident_backstage/incident_backstage';
import PlaybookBackstage from 'src/components/backstage/playbooks/playbook_backstage';
import {useExperimentalFeaturesEnabled} from 'src/hooks';
import CloudModal from 'src/components/cloud_modal';

import StatsView from './stats';
import SettingsView from './settings';

const BackstageContainer = styled.div`
    background: var(--center-channel-bg);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

export const BackstageNavbarIcon = styled.button`
    border: none;
    outline: none;
    background: transparent;
    border-radius: 4px;
    font-size: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--center-channel-color-56);

    &:hover {
        background: var(--button-bg-08);
        text-decoration: unset;
        color: var(--button-bg);
    }
`;

export const BackstageNavbar = styled.div`
    position: sticky;
    width: 100%;
    top: 0;
    z-index: 2;

    display: flex;
    align-items: center;
    padding: 28px 31px;
    background: var(--center-channel-bg);
    color: var(--center-channel-color);
    font-family: 'compass-icons';
    box-shadow: inset 0px -1px 0px var(--center-channel-color-16);

    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
`;

const BackstageTitlebarItem = styled(NavLink)`
    && {
        font-size: 16px;
        cursor: pointer;
        color: var(--center-channel-color);
        fill: var(--center-channel-color);
        padding: 0 8px;
        margin-right: 39px;
        display: flex;
        align-items: center;

        &:hover {
            text-decoration: unset;
            color: var(--button-bg);
            fill: var(--button-bg);
        }

        &.active {
            color: var(--button-bg);
            fill: var(--button-bg);
            text-decoration: unset;
        }
    }
`;

const BackstageBody = styled.div`
    z-index: 1;
    flex-grow: 1;
`;

const Backstage = () => {
    useEffect(() => {
        // This class, critical for all the styling to work, is added by ChannelController,
        // which is not loaded when rendering this root component.
        document.body.classList.add('app__body');

        return function cleanUp() {
            document.body.classList.remove('app__body');
        };
    }, []);

    const currentTeam = useSelector<GlobalState, Team>(getCurrentTeam);

    const match = useRouteMatch();

    const goToMattermost = () => {
        navigateToUrl(`/${currentTeam.name}`);
    };

    const experimentalFeaturesEnabled = useExperimentalFeaturesEnabled();

    return (
        <BackstageContainer>
            <BackstageNavbar className='flex justify-content-between'>
                <div className='d-flex items-center'>
                    {experimentalFeaturesEnabled &&
                        <BackstageTitlebarItem
                            to={`${match.url}/stats`}
                            activeClassName={'active'}
                            data-testid='statsLHSButton'
                        >
                            <span className='mr-3 d-flex items-center'>
                                <div className={'fa fa-line-chart'}/>
                            </span>
                            {'Stats'}
                        </BackstageTitlebarItem>
                    }
                    <BackstageTitlebarItem
                        to={`${match.url}/incidents`}
                        activeClassName={'active'}
                        data-testid='incidentsLHSButton'
                    >
                        <span className='mr-3 d-flex items-center'>
                            <IncidentIcon/>
                        </span>
                        {'Incidents'}
                    </BackstageTitlebarItem>
                    <BackstageTitlebarItem
                        to={`${match.url}/playbooks`}
                        activeClassName={'active'}
                        data-testid='playbooksLHSButton'
                    >
                        <span className='mr-3 d-flex items-center'>
                            <PlaybookIcon/>
                        </span>
                        {'Playbooks'}
                    </BackstageTitlebarItem>
                    <BackstageTitlebarItem
                        to={`${match.url}/settings`}
                        activeClassName={'active'}
                        data-testid='settingsLHSButton'
                    >
                        <span className='mr-3 d-flex items-center'>
                            <div className={'fa fa-gear'}/>
                        </span>
                        {'Settings'}
                    </BackstageTitlebarItem>
                </div>
                <BackstageNavbarIcon
                    className='icon-close close-icon'
                    onClick={goToMattermost}
                />
            </BackstageNavbar>
            <BackstageBody>
                <Switch>
                    <Route path={`${match.url}/playbooks/new`}>
                        <NewPlaybook
                            currentTeam={currentTeam}
                        />
                    </Route>
                    <Route path={`${match.url}/playbooks/:playbookId/edit`}>
                        <PlaybookEdit
                            isNew={false}
                            currentTeam={currentTeam}
                        />
                    </Route>
                    <Route path={`${match.url}/playbooks/:playbookId`}>
                        <PlaybookBackstage/>
                    </Route>
                    <Route path={`${match.url}/playbooks`}>
                        <PlaybookList/>
                    </Route>
                    <Route path={`${match.url}/incidents/:incidentId`}>
                        <IncidentBackstage/>
                    </Route>
                    <Route path={`${match.url}/incidents`}>
                        <BackstageIncidentList/>
                        {/*<Dashboard/>*/}
                    </Route>
                    <Route path={`${match.url}/stats`}>
                        <StatsView/>
                    </Route>
                    <Route path={`${match.url}/settings`}>
                        <SettingsView/>
                    </Route>
                    <Route
                        exact={true}
                        path={`${match.url}/`}
                    >
                        <Redirect to={experimentalFeaturesEnabled ? `${match.url}/stats` : `${match.url}/incidents`}/>
                    </Route>
                    <Route>
                        <Redirect to={teamPluginErrorUrl(currentTeam.name, ErrorPageTypes.DEFAULT)}/>
                    </Route>
                </Switch>
            </BackstageBody>
            <CloudModal/>
        </BackstageContainer>
    );
};

export default Backstage;
