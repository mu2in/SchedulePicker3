import { MyGroupEvent, ScheduleEvent } from '../../garoon/schedule';
import { DateTime } from '../../utils/date-time';

export abstract class Syntax {
    protected isMyGroupEvent(event: ScheduleEvent | MyGroupEvent): event is MyGroupEvent {
        return 'members' in event;
    }

    abstract createTitle(date: DateTime): string;
    abstract createEvent(event: ScheduleEvent | MyGroupEvent): string;
    abstract createEvents(events: ScheduleEvent[] | MyGroupEvent[]): string;
    abstract getNewLine(): string;
}
