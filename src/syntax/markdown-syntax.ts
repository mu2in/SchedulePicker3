import { ScheduleEvent } from '../garoon/schedule';
import { DateTime, formatDateTime } from '../utils/date-time';
import { Syntax } from './base/syntax';
import { getEventMenuColorCode } from './colors';

export class MarkdownSyntax extends Syntax {
    createTitle(dateTime: DateTime) {
        return `[ ${formatDateTime(dateTime, 'YYYY-MM-DD')} の予定 ]`;
    }

    createEvent(event: ScheduleEvent) {
        const timeRange = this.createTimeRange(event.startTime, event.endTime);
        const subject = this.createSubject(event.id, event.subject);
        const eventMenu = event.eventMenu === '' ? null : this.createEventMenu(event.eventMenu);

        if (eventMenu === null) {
            return `${timeRange} ${subject}`;
        }

        if (event.isAllDay) {
            return `${eventMenu} ${subject}`;
        }

        return `${timeRange} ${eventMenu} ${subject}`;
    }

    createEvents(events: ScheduleEvent[]) {
        return events
            .map((event) => `${this.createEvent(event)}${this.getNewLine()}`)
            .join('')
            .replace(new RegExp(`${this.getNewLine()}$`), '');
    }

    getNewLine(): string {
        return '\n';
    }

    private createTimeRange(startTime: DateTime, endTime: DateTime) {
        const formattedStartTime = formatDateTime(startTime, 'HH:mm');
        const formattedEndTime = formatDateTime(endTime, 'HH:mm');
        return `${formattedStartTime}-${formattedEndTime}`;
    }

    private createEventMenu(eventMenu: string) {
        return `<span style="color: ${getEventMenuColorCode(eventMenu)};">[${eventMenu}]</span>`;
    }

    private createSubject(eventId: string, subject: string) {
        return `[${subject}](https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventId})`;
    }
}
