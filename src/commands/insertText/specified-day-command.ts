import { getMyGroupEvents, getScheduleEvents } from '../../garoon/schedule';
import { getSyntax } from '../../storage/storage';
import { SyntaxFactory } from '../../syntax/syntax-factory';
import {
    createEndOfTime,
    createStartOfTime,
    formatDateTime,
    getNowDateTime,
    isValidDateFormat,
    stringToDateTime,
} from '../../utils/date-time';
import { InsertTextCommand } from './insert-text-command';

export class SpecifiedDayCommand extends InsertTextCommand {
    protected async createSchedule(domain: string, groupId: string | null): Promise<string | null> {
        const promptResult = window.prompt(
            '取得したい予定の日付を入力してください\n例: 2021/09/19',
            formatDateTime(getNowDateTime(), 'YYYY/MM/DD'),
        );
        if (promptResult === null) {
            // キャンセルが押されたとき
            return null;
        }

        if (!isValidDateFormat(promptResult)) {
            window.alert(`"${promptResult}"は無効な日付フォーマットです`);
            return null;
        }

        const dateTime = stringToDateTime(promptResult);
        const startTime = createStartOfTime(dateTime);
        const endTime = createEndOfTime(dateTime);
        const events =
            groupId === null
                ? await getScheduleEvents(domain, {
                      startTime,
                      endTime,
                  })
                : await getMyGroupEvents(domain, {
                      groupId,
                      startTime,
                      endTime,
                  });
        const syntax = await getSyntax();
        const factory = new SyntaxFactory().create(syntax);
        return factory.createTitle(dateTime) + factory.getNewLine() + factory.createEvents(events);
    }
}
