var isNode = typeof module !== 'undefined' && module.exports, 
    React = isNode ? require('react') : window.React, 
    ReactDOM = isNode ? require('react') : window.ReactDOM;

var SetIntervalMixin = {
    componentWillMount: function() {
        this.intervals = [];
    },
    setInterval: function() {
        this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount: function() {
        this.intervals.forEach(clearInterval);
    }
};

function doubleD(n){
    return n > 9 ? "" + n: "0" + n;
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
        newStart.setDate(newStart.getDate() + (eventStartTime.getDay()+(7-newStart.getDay())) % 7 + 7);
        newEnd.setDate(newEnd.getDate() + (eventEndTime.getDay()+(7-newEnd.getDay())) % 7 + 7);
    }
    else {
        newStart.setDate(newStart.getDate() + (eventStartTime.getDay()+(7-newStart.getDay())) % 7);
        newEnd.setDate(newEnd.getDate() + (eventEndTime.getDay()+(7-newEnd.getDay())) % 7);
    }
    
    return [newStart, newEnd];
}

var Timer = React.createClass({
    mixins: [SetIntervalMixin],
    getInitialState: function () {   
        var now = new Date();
    
        return {
            announcements: null,
            daily: null,
            weekly: null,
            community: null,
            currentTime: now
        };
    },
    componentDidMount: function() {
        this.fetch();
    
        this.setInterval(this.fetch, 3600000); // Call a method on the mixin
        
        this.setInterval(this.tick, 1000); // Call a method on the mixin
    },
    fetch: function() {
        var t = this;
        $.post('/timer/data', {itemType: t.state.itemType}, function(data, status){
            t.setState({
                announcements: data[0],
                daily: data[1],
                weekly: data[2],
                community: data[3]
            });
        });
    },
    tick: function() {
        this.setState({
            currentTime: new Date()
        });
    },
    render: function () {
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
                announcements.push(
                    <div className="announcement">
                        Announcement: <a target="_blank" href={aData.link}>{aData.title}</a>
                        <span className="aTime">
                            {eventStartTime.toDateString()} {eventStartTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})} ~ {eventEndTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                );
            }
            else if (aData.notice) {
                announcements.push(
                    <div className="info">
                        Notice: {aData.title}
                    </div>
                );
            }
        }
            
        for (var d in this.state.daily) {
            var dailyEvent = this.state.daily[d],
                dailyTimeNA = new Date(dailyEvent.timeNA),
                dailyTimeEU = new Date(dailyEvent.timeEU);
        
            daily.push(
                <div className="event">
                    <span className="eventIcon">
                        <img height="25" width="25" src={"/img/" + dailyEvent.icon + ".png"} />
                    </span>
                    <span className="eventTime">
                        <p><span className="region">NA</span> {dailyTimeNA.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</p>
                        <p><span className="region">EU</span> {dailyTimeEU.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</p>
                    </span>
                    <span className="eventName">{dailyEvent.title}</span>
                </div>
            );
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
        
            weekly.push(
                <div className="event">
                    <span className="eventIcon">
                        <img height="25" width="25" src={"/img/" + weeklyEvent.icon + ".png"} />
                    </span>
                    <span className="eventTime">
                        <p>{dow}</p>
                        <p><span className="region">NA</span> {weeklyTimeNA.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</p>
                        <p><span className="region">EU</span> {weeklyTimeEU.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</p>
                    </span>
                    <span className="eventName">{weeklyEvent.title}</span>
                </div>
            );
            
            if (weeklyEvent.autoAnnounce) {
                var newTimes = nextWeek(weeklyTimeNA, new Date(weeklyEvent.endTime));
                var eventStartTime = newTimes[0];
                var eventEndTime = newTimes[1];
            
                if (eventStartTime < now && now < eventEndTime) {
                    announcements.push(
                        <div className="announcement">
                            Announcement: <a target="_blank" href={weeklyEvent.link}>{weeklyEvent.announceText}</a>
                            <span className="aTime">
                                {eventStartTime.toDateString()} {eventStartTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})} ~ {eventEndTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    );
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
            
            priorTime.setDate(eventStartTime.getDate()-5);
            
            var desc = null,
                live = null;
            if (cData.preDesc && now < eventStartTime && now > priorTime) {
                if (cData.preDescLink) {
                    desc = <p><a className="descLink" target="_blank" href={cData.preDescLink}>{cData.preDesc}</a></p>;
                }
                else {
                    desc = <p>{cData.preDesc}</p>;
                }
            }
            else if (cData.liveDesc && eventStartTime < now && now < eventEndTime) {
                if (cData.liveDescLink) {
                    desc = <p><a className="descLink" target="_blank" href={cData.liveDescLink}>{cData.liveDescLink}</a></p>;
                }
                else {
                    desc = <p>{cData.liveDescLink}</p>;
                }
            }
            else if (cData.desc){
                if (cData.descLink) {
                    desc = <p><a className="descLink" target="_blank" href={cData.descLink}>{cData.desc}</a></p>;
                }
                else {
                    desc = <p>{cData.desc}</p>;
                }
            }
            
            if (eventStartTime < now && now < eventEndTime) {
                live = <span className="region">Now </span>;
            }
            
            if (cData.recurring == "weekly" || now < eventEndTime) {
                community.push([
                    <div className="event">
                        <span className="eventIcon">
                            <img height="50" width="50" src={cData.icon} />
                        </span>
                        <span className="eventTime com">
                            <p>{eventStartTime.toDateString()}</p>
                            <p>{eventStartTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})} ~ {eventEndTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</p>
                        </span>
                        <span className="eventName col-sm-7">
                            <p><a target="_blank" href={cData.link}>{cData.title}</a></p>
                            {live}{desc}
                        </span>
                    </div>, 
                    eventStartTime.getTime()
                ]);
            }
        }
        
        var sortedCommunity = [];
        community.sort(function(a,b) {
            return a[1] - b[1];
        });
        
        for (var c in community) {
            sortedCommunity.push(community[c][0]);
        }
        
        return (
            <div className="timer">
                <div className="time">
                    <p className="region">Local Time</p>
                    <h2 className="clock">{now.toLocaleTimeString()} <small>{now.toDateString()}</small></h2>
                </div>
                <hr />
                <div className="announcements">
                    {announcements}
                </div>
                <div className="events">
                    <div className="ingame">
                        <div className="col-md-6">
                            <h4>Daily Events</h4>
                            {daily}
                        </div>
                        <div className="col-md-6">
                            <h4>Weekly Events</h4>
                            {weekly}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


if (isNode) {
    exports.Timer = Timer;
} else {
    ReactDOM.render(
        <Timer />,
        document.getElementById('timer-wrap')
    );
}