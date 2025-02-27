import { ArgumentValidationError } from "type-graphql";

export function validateAndParse(dateStr: string, paramName: string): Date {
    // Validate format
    if (!isValidISODateString(dateStr)) {
        throw new ArgumentValidationError([{
            property: paramName,
            constraints: {
                isIsoDate: `${paramName} must be a valid ISO 8601 date string (e.g., "2023-04-15T14:30:00Z")`
            }
        }]);
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new ArgumentValidationError([{
            property: paramName,
            constraints: {
                isValidDate: `${paramName} must be a valid date`
            }
        }]);
    }

    return date;
}

export function validateDateRange(
    startDate: Date,
    endDate: Date,
    startParamName: string = 'startTime',
    endParamName: string = 'endTime'
): void {
    if (startDate > endDate) {
        throw new ArgumentValidationError([{
            property: startParamName,
            constraints: {
                dateRange: `${startParamName} must be before or equal to ${endParamName}`
            }
        }]);
    }
}

function isValidISODateString(dateStr: string): boolean {
    // Match common ISO 8601 formats
    // Supports:
    // - YYYY-MM-DDTHH:MM:SSZ
    // - YYYY-MM-DDTHH:MM:SS.sssZ
    // - YYYY-MM-DDTHH:MM:SS+HH:MM
    // - YYYY-MM-DDTHH:MM:SS-HH:MM
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;
    return isoDatePattern.test(dateStr);
}
