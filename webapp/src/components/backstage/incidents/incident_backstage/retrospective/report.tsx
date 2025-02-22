// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState} from 'react';
import styled from 'styled-components';

import {StyledTextarea} from 'src/components/backstage/styles';
import {
    Title,
    SecondaryButton,
} from 'src/components/backstage/incidents/shared';
import {Incident} from 'src/types/incident';
import {publishRetrospective, updateRetrospective} from 'src/client';
import {PrimaryButton} from 'src/components/assets/buttons';
import PostText from 'src/components/post_text';

const Header = styled.div`
    display: flex;
    align-items: center;
`;

const ReportTextarea = styled(StyledTextarea)`
    margin: 8px 0 0 0;
    min-height: 200px;
    font-size: 12px;
    flex-grow: 1;
`;

const CustomPrimaryButton = styled(PrimaryButton)`
    height: 26px;
    font-size: 12px;
`;

const HeaderButtonsRight = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row-reverse;
    > * {
        margin-left: 10px;
    }
`;

const PostTextContainer = styled.div`
    background: var(--center-channel-bg);
    margin: 8px 0 0 0;
    padding: 10px 25px 0 16px;
    border: 1px solid var(--center-channel-color-08);
    border-radius: 8px;
    flex-grow: 1;
`;

const ReportContainer = styled.div`
    font-size: 12px;
    font-weight: normal;
    margin-bottom: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

interface ReportProps {
    incident: Incident;
}

const Report = (props: ReportProps) => {
    const [report, setReport] = useState(props.incident.retrospective);
    const [editing, setEditing] = useState(false);
    const [publishedThisSession, setPublishedThisSession] = useState(false);

    const savePressed = () => {
        updateRetrospective(props.incident.id, report);
        setEditing(false);
    };

    const publishPressed = () => {
        publishRetrospective(props.incident.id, report);
        setEditing(false);
        setPublishedThisSession(true);
    };

    let publishButtonText: React.ReactNode = 'Publish';
    if (publishedThisSession) {
        publishButtonText = (
            <>
                <i className={'icon icon-check'}/>
                {'Published'}
            </>
        );
    } else if (props.incident.retrospective_published_at && !props.incident.retrospective_was_canceled) {
        publishButtonText = 'Republish';
    }

    return (
        <ReportContainer>
            <Header>
                <Title>{'Report'}</Title>
                <HeaderButtonsRight>
                    <CustomPrimaryButton
                        onClick={publishPressed}
                    >
                        <TextContainer>{publishButtonText}</TextContainer>
                    </CustomPrimaryButton>
                    <EditButton
                        editing={editing}
                        onSave={savePressed}
                        onEdit={() => setEditing(true)}
                    />
                </HeaderButtonsRight>
            </Header>
            {editing &&
                <ReportTextarea
                    value={report}
                    onChange={(e) => {
                        setReport(e.target.value);
                    }}
                />
            }
            {!editing &&
                <PostTextContainer>
                    <PostText text={report}/>
                </PostTextContainer>
            }
        </ReportContainer>
    );
};

interface SaveButtonProps {
    editing: boolean;
    onEdit: () => void
    onSave: () => void
}

const TextContainer = styled.span`
    display: flex;
    justify-content: center;
    width: 65px;
    flex-grow: 1;
`;

const EditButton = (props: SaveButtonProps) => {
    if (props.editing) {
        return (
            <SecondaryButton
                onClick={props.onSave}
            >
                <TextContainer>
                    <i className={'fa fa-floppy-o'}/>
                    {'Save'}
                </TextContainer>
            </SecondaryButton>
        );
    }

    return (
        <SecondaryButton
            onClick={props.onEdit}
        >
            <TextContainer>
                <i className={'icon icon-pencil-outline'}/>
                {'Edit'}
            </TextContainer>
        </SecondaryButton>
    );
};

export default Report;
