'use strict';

var isNode = typeof module !== 'undefined' && module.exports,
    React = isNode ? require('react') : window.React,
    ReactDOM = isNode ? require('react') : window.ReactDOM;

var SetIntervalMixin = {
    componentWillMount: function componentWillMount() {
        this.intervals = [];
    },
    setInterval: function (_setInterval) {
        function setInterval() {
            return _setInterval.apply(this, arguments);
        }

        setInterval.toString = function () {
            return _setInterval.toString();
        };

        return setInterval;
    }(function () {
        this.intervals.push(setInterval.apply(null, arguments));
    }),
    componentWillUnmount: function componentWillUnmount() {
        this.intervals.forEach(clearInterval);
    }
};

function doubleD(n) {
    return n > 9 ? "" + n : "0" + n;
}

function nextWeek(eventStartTime, eventEndTime) {
    var now = new Date(),
        newStart = new Date(),
        newEnd = new Date();

    newStart.setMinutes(eventStartTime.getMinutes());
    newStart.setHours(eventStartTime.getHours());
    newEnd.setMinutes(eventEndTime.getMinutes());
    newEnd.setHours(eventEndTime.getHours());

    if (now.getDay() == eventStartTime.getDay() && (now.getHours() > newEnd.getHours() || now.getHours() == newEnd.getHours() && now.getMinutes() > newEnd.getMinutes())) {
        newStart.setDate(newStart.getDate() + (eventStartTime.getDay() + (7 - newStart.getDay())) % 7 + 7);
        newEnd.setDate(newEnd.getDate() + (eventEndTime.getDay() + (7 - newEnd.getDay())) % 7 + 7);
    } else {
        newStart.setDate(newStart.getDate() + (eventStartTime.getDay() + (7 - newStart.getDay())) % 7);
        newEnd.setDate(newEnd.getDate() + (eventEndTime.getDay() + (7 - newEnd.getDay())) % 7);
    }

    return [newStart, newEnd];
}

var Timer = React.createClass({
    displayName: 'Timer',

    mixins: [SetIntervalMixin],
    getInitialState: function getInitialState() {
        var now = new Date();

        return {
            announcements: null,
            daily: null,
            weekly: null,
            community: null,
            currentTime: now
        };
    },
    componentDidMount: function componentDidMount() {
        this.fetch();

        this.setInterval(this.fetch, 3600000); // Call a method on the mixin

        this.setInterval(this.tick, 1000); // Call a method on the mixin
    },
    fetch: function fetch() {
        var t = this;
        $.post('/timer/data', { itemType: t.state.itemType }, function (data, status) {
            t.setState({
                announcements: data[0],
                daily: data[1],
                weekly: data[2],
                community: data[3]
            });
        });
    },
    tick: function tick() {
        this.setState({
            currentTime: new Date()
        });
    },
    render: function render() {
        var now = this.state.currentTime;

        var announcements = [],
            daily = [],
            weekly = [],
            community = [];

        for (var a in this.state.announcements) {
            var aData = this.state.announcements[a],
                eventStartTime = new Date(aData.startTime),
                eventEndTime = new Date(aData.endTime);

            if (eventStartTime < now && now < eventEndTime) {
                announcements.push(React.createElement(
                    'div',
                    { className: 'announcement' },
                    'Announcement: ',
                    React.createElement(
                        'a',
                        { target: '_blank', href: aData.link },
                        aData.title
                    ),
                    React.createElement(
                        'span',
                        { className: 'aTime' },
                        eventStartTime.toDateString(),
                        ' ',
                        eventStartTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
                        ' ~ ',
                        eventEndTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                    )
                ));
            } else if (aData.notice) {
                announcements.push(React.createElement(
                    'div',
                    { className: 'info' },
                    'Notice: ',
                    aData.title
                ));
            }
        }

        for (var d in this.state.daily) {
            var dailyEvent = this.state.daily[d],
                dailyTimeNA = new Date(dailyEvent.timeNA),
                dailyTimeEU = new Date(dailyEvent.timeEU);

            daily.push(React.createElement(
                'div',
                { className: 'event' },
                React.createElement(
                    'span',
                    { className: 'eventIcon' },
                    React.createElement('img', { height: '25', width: '25', src: "/img/" + dailyEvent.icon + ".png" })
                ),
                React.createElement(
                    'span',
                    { className: 'eventTime' },
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'span',
                            { className: 'region' },
                            'NA'
                        ),
                        ' ',
                        dailyTimeNA.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'span',
                            { className: 'region' },
                            'EU'
                        ),
                        ' ',
                        dailyTimeEU.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                    )
                ),
                React.createElement(
                    'span',
                    { className: 'eventName' },
                    dailyEvent.title
                )
            ));
        }

        for (var w in this.state.weekly) {
            var weeklyEvent = this.state.weekly[w],
                weeklyTimeNA = new Date(weeklyEvent.timeNA),
                weeklyTimeEU = new Date(weeklyEvent.timeEU),
                dow = "";

            switch (weeklyTimeNA.getDay()) {
                case 0:
                    dow = "Sunday";
                    break;
                case 1:
                    dow = "Monday";
                    break;
                case 2:
                    dow = "Tuesday";
                    break;
                case 3:
                    dow = "Wednesday";
                    break;
                case 4:
                    dow = "Thursday";
                    break;
                case 5:
                    dow = "Friday";
                    break;
                case 6:
                    dow = "Saturday";
                    break;
            }

            weekly.push(React.createElement(
                'div',
                { className: 'event' },
                React.createElement(
                    'span',
                    { className: 'eventIcon' },
                    React.createElement('img', { height: '25', width: '25', src: "/img/" + weeklyEvent.icon + ".png" })
                ),
                React.createElement(
                    'span',
                    { className: 'eventTime' },
                    React.createElement(
                        'p',
                        null,
                        dow
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'span',
                            { className: 'region' },
                            'NA'
                        ),
                        ' ',
                        weeklyTimeNA.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'span',
                            { className: 'region' },
                            'EU'
                        ),
                        ' ',
                        weeklyTimeEU.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                    )
                ),
                React.createElement(
                    'span',
                    { className: 'eventName' },
                    weeklyEvent.title
                )
            ));

            if (weeklyEvent.autoAnnounce) {
                var newTimes = nextWeek(weeklyTimeNA, new Date(weeklyEvent.endTime));
                var eventStartTime = newTimes[0];
                var eventEndTime = newTimes[1];

                if (eventStartTime < now && now < eventEndTime) {
                    announcements.push(React.createElement(
                        'div',
                        { className: 'announcement' },
                        'Announcement: ',
                        React.createElement(
                            'a',
                            { target: '_blank', href: weeklyEvent.link },
                            weeklyEvent.announceText
                        ),
                        React.createElement(
                            'span',
                            { className: 'aTime' },
                            eventStartTime.toDateString(),
                            ' ',
                            eventStartTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
                            ' ~ ',
                            eventEndTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                        )
                    ));
                }
            }
        }

        for (var c in this.state.community) {
            var cData = this.state.community[c],
                eventStartTime = new Date(cData.startTime),
                eventEndTime = new Date(cData.endTime),
                priorTime = new Date();

            if (cData.recurring == "weekly") {
                var newTimes = nextWeek(eventStartTime, eventEndTime);

                eventStartTime = newTimes[0];
                eventEndTime = newTimes[1];
                priorTime = new Date(eventStartTime.getTime());
            }

            priorTime.setDate(eventStartTime.getDate() - 5);

            var desc = null,
                live = null;
            if (cData.preDesc && now < eventStartTime && now > priorTime) {
                if (cData.preDescLink) {
                    desc = React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'a',
                            { className: 'descLink', target: '_blank', href: cData.preDescLink },
                            cData.preDesc
                        )
                    );
                } else {
                    desc = React.createElement(
                        'p',
                        null,
                        cData.preDesc
                    );
                }
            } else if (cData.liveDesc && eventStartTime < now && now < eventEndTime) {
                if (cData.liveDescLink) {
                    desc = React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'a',
                            { className: 'descLink', target: '_blank', href: cData.liveDescLink },
                            cData.liveDescLink
                        )
                    );
                } else {
                    desc = React.createElement(
                        'p',
                        null,
                        cData.liveDescLink
                    );
                }
            } else if (cData.desc) {
                if (cData.descLink) {
                    desc = React.createElement(
                        'p',
                        null,
                        React.createElement(
                            'a',
                            { className: 'descLink', target: '_blank', href: cData.descLink },
                            cData.desc
                        )
                    );
                } else {
                    desc = React.createElement(
                        'p',
                        null,
                        cData.desc
                    );
                }
            }

            if (eventStartTime < now && now < eventEndTime) {
                live = React.createElement(
                    'span',
                    { className: 'region' },
                    'Now '
                );
            }

            if (cData.recurring == "weekly" || now < eventEndTime) {
                community.push([React.createElement(
                    'div',
                    { className: 'event' },
                    React.createElement(
                        'span',
                        { className: 'eventIcon' },
                        React.createElement('img', { height: '50', width: '50', src: cData.icon })
                    ),
                    React.createElement(
                        'span',
                        { className: 'eventTime com' },
                        React.createElement(
                            'p',
                            null,
                            eventStartTime.toDateString()
                        ),
                        React.createElement(
                            'p',
                            null,
                            eventStartTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
                            ' ~ ',
                            eventEndTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
                        )
                    ),
                    React.createElement(
                        'span',
                        { className: 'eventName col-sm-7' },
                        React.createElement(
                            'p',
                            null,
                            React.createElement(
                                'a',
                                { target: '_blank', href: cData.link },
                                cData.title
                            )
                        ),
                        live,
                        desc
                    )
                ), eventStartTime.getTime()]);
            }
        }

        var sortedCommunity = [];
        community.sort(function (a, b) {
            return a[1] - b[1];
        });

        for (var c in community) {
            sortedCommunity.push(community[c][0]);
        }

        return React.createElement(
            'div',
            { className: 'timer' },
            React.createElement(
                'div',
                { className: 'time' },
                React.createElement(
                    'p',
                    { className: 'region' },
                    'Local Time'
                ),
                React.createElement(
                    'h2',
                    { className: 'clock' },
                    now.toLocaleTimeString(),
                    ' ',
                    React.createElement(
                        'small',
                        null,
                        now.toDateString()
                    )
                )
            ),
            React.createElement('hr', null),
            React.createElement(
                'div',
                { className: 'announcements' },
                announcements
            ),
            React.createElement(
                'div',
                { className: 'events' },
                React.createElement(
                    'div',
                    { className: 'ingame' },
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(
                            'h4',
                            null,
                            'Daily Events'
                        ),
                        daily
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(
                            'h4',
                            null,
                            'Weekly Events'
                        ),
                        weekly
                    )
                )
            )
        );
    }
});

if (isNode) {
    exports.Timer = Timer;
} else {
    ReactDOM.render(React.createElement(Timer, null), document.getElementById('timer-wrap'));
}