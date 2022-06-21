import { i18n } from 'webextension-polyfill';
import { getMyGroupEvents, getScheduleEvents } from '../../events/schedule';
import { getAllDayEventsIncluded, getSyntax } from '../../storage';
import { SyntaxGeneratorFactory } from '../../syntax/syntax-generator-factory';
import { convertToEndOfDay, convertToStartOfDay, dateTime, isValidDateFormat } from '../../util/date-time';
import { AbstractInsertScheduleCommand } from './abstract-insert-schedule-command';

export class SpecifiedDayCommand extends AbstractInsertScheduleCommand {
    protected async getSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const promptResult = prompt(
            i18n.getMessage('prompt_specified_date_description'),
            dateTime().format('YYYY/MM/DD'),
        );
        if (promptResult === null) {
            // キャンセルが押されたとき
            return null;
        }

        if (!isValidDateFormat(promptResult)) {
            alert(i18n.getMessage('error_invalid_date_format', promptResult));
            return null;
        }

        const resultDateTime = dateTime(promptResult);
        const startTime = convertToStartOfDay(resultDateTime);
        const endTime = convertToEndOfDay(resultDateTime);
        const alldayEventsIncluded = await getAllDayEventsIncluded();
        const events =
            groupId === null
                ? await getScheduleEvents(domain, {
                      startTime,
                      endTime,
                      alldayEventsIncluded,
                  })
                : await getMyGroupEvents(domain, {
                      groupId,
                      startTime,
                      endTime,
                      alldayEventsIncluded,
                  });
        const syntax = await getSyntax();
        const generator = new SyntaxGeneratorFactory().create(syntax);
        return generator.createTitle(resultDateTime) + generator.getNewLine() + generator.createEvents(domain, events);
    }
}
