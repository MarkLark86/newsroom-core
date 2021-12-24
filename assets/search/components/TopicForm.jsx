import React from 'react';
import PropTypes from 'prop-types';

import TextInput from 'components/TextInput';
import CheckboxInput from 'components/CheckboxInput';

import {gettext} from 'utils';

const TOPIC_NAME_MAXLENGTH = 30;

const TopicForm = ({topic, save, onChange, globalTopicsEnabled}) => (
    <div>
        <form onSubmit={save}>
            <TextInput
                label={gettext('Name')}
                required={true}
                value={topic.label}
                onChange={onChange('label')}
                maxLength={TOPIC_NAME_MAXLENGTH}
                autoFocus={true}
            />
            <CheckboxInput
                label={gettext('Send me notifications')}
                value={topic.notifications || false}
                onChange={onChange('notifications')}
            />
            {!globalTopicsEnabled ? null : (
                <CheckboxInput
                    label={gettext('Share with my Company')}
                    value={topic.is_global || false}
                    onChange={onChange('is_global')}
                />
            )}
        </form>
    </div>
);

TopicForm.propTypes = {
    topic: PropTypes.object.isRequired,
    globalTopicsEnabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
};

export default TopicForm;
