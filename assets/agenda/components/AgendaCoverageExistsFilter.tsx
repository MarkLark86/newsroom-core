import React from 'react';

import {gettext, getConfig} from 'utils';
import {AgendaDropdown} from './AgendaDropdown';

type ICoverageStatusOptionValue = 'planned' | 'not planned' | 'may be' | 'not intended' | 'completed';

interface IProps {
    toggleFilter(field: string, value?: ICoverageStatusOptionValue): void;
    activeFilter: {coverage_status?: Array<ICoverageStatusOptionValue>};
}

interface ICoverageStatusOptionConfig {
    enabled: boolean;
    option_label: string;
    button_label: string;
}

type ICoverageStatusFilterConfig = {[value in ICoverageStatusOptionValue]: ICoverageStatusOptionConfig};

export const filter = {
    label: gettext('Any coverage status'),
    field: 'coverage_status',
    nestedField: 'coverage_status',
};

export function getActiveFilterLabel(
    filter: {label: string; field: string},
    activeFilter?: {
        coverage_status?: Array<ICoverageStatusOptionValue>;
        [field: string]: any;
    }
) {
    const config: ICoverageStatusFilterConfig = getConfig('coverage_status_filter');

    return activeFilter?.coverage_status?.[0] != null ?
        config[activeFilter.coverage_status[0]].button_label :
        filter.label;
}

function AgendaCoverageExistsFilter({toggleFilter, activeFilter}: IProps) {
    const config: ICoverageStatusFilterConfig = getConfig('coverage_status_filter');
    const enabledOptions= ([
        'planned',
        'may be',
        'not intended',
        'not planned',
        'completed',
    ]
        .filter((option) => (config[option as ICoverageStatusOptionValue]?.enabled === true))
    ) as Array<ICoverageStatusOptionValue>;

    return (
        <AgendaDropdown
            filter={filter}
            activeFilter={activeFilter}
            toggleFilter={toggleFilter}
            getFilterLabel={getActiveFilterLabel}
            optionLabel={gettext('Coverage')}
            hideLabelOnMobile
            resetOptionLabel={gettext('Clear selection')}
            dropdownMenuHeader={gettext('Coverage status')}
        >
            {enabledOptions.map((option) => (
                config[option]?.enabled !== true ? null : (
                    <button
                        key={`coverage-${option}`}
                        className="dropdown-item"
                        onClick={() => toggleFilter(filter.field, option)}
                    >
                        {config[option].option_label}
                    </button>
                )
            ))}
        </AgendaDropdown>
    );
}

export default AgendaCoverageExistsFilter;
