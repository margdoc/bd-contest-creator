import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { RangeDatePicker } from '@y0c/react-datepicker';
import TimePicker from 'rc-time-picker';
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import moment, { Moment } from 'moment';
import dayjs, { Dayjs } from 'dayjs';
import 'rc-time-picker/assets/index.css';

import { WebAppClient } from "../api/client";
import { AccessWrapper, PageProps, AlertPrompt } from './utils';

interface Dates {
    start: Dayjs;
    end: Dayjs;
}

interface Time {
    start: Moment;
    end: Moment;
}

export const CreateContestPage: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [dates, setDates] = useState<Dates>({ start: dayjs(), end: dayjs() });
    const [time, setTime] = useState<Time>({ start: moment(), end: moment() });
    const [errorMessage, setError] = useState("");

    const create = (event: React.FormEvent) => {
        event.preventDefault();
        
        const title: string = (document.getElementById("contest-title")  as HTMLInputElement).value;

        const toDate = (time: Moment, day: Dayjs) => {
            const normalizedDate = moment(day instanceof Date ? day : day.toDate()).hour(0).minute(0).millisecond(0);
            
            return normalizedDate.add(time.hour(), 'hours').add(time.minute(), 'minutes').millisecond(0).toDate();
        }

        const start = toDate(time.start, dates.start);
        const end = toDate(time.end, dates.end);
        console.log(start.toJSON());

       WebAppClient.postCreateContest({ title, startDate: `"${start.toJSON()}"`, endDate: `"${end.toJSON()}"` }, 
        response => {
            window.location.href = '/contests-controller/my';
        }, error => {
            const errors = error.response?.data.errors;
            setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            console.log(error);
        });
    };

    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Control id="contest-title" type="text" placeholder="title" />
                </Form.Group>
                <Form.Group>
                <Form.Label>Dates</Form.Label><br/>
                    <RangeDatePicker
                        onChange={(start?: Dayjs, end?: Dayjs) =>
                            setDates(prevState => ({
                                start: start || prevState.start,
                                end: end || prevState.end
                            }))
                        }
                        startDay={dates.start}
                        endDay={dates.end}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Start Time</Form.Label><br/>
                    <TimePicker
                        onChange={(time: Moment) => time && setTime(prevState => ({...prevState, start: time}))}
                        defaultValue={time.start}
                        showSecond={false}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>End Time</Form.Label><br/>
                    <TimePicker
                        onChange={(time: Moment) => time && setTime(prevState => ({...prevState, end: time}))}
                        defaultValue={time.end}
                        showSecond={false}
                    />
                </Form.Group>
                <Button type="submit" onClick={create}>Create</Button>
            </Form>
            <AlertPrompt text={errorMessage} />
        </div>
    );
});