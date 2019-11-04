import moment from 'moment';
import * as ical from 'ical-generator';

function run() {
  var thevue = new Vue({
    el: '#vueClasses',
    data: {
      searchtext: '',
      searchresults: [],
      chosens: []
    },
    methods: {
      emptyexport: function () {
        alert("Don't forget to add at least 1 class!");
      },
      exportics: function () {
        if (!this.chosens.length) {
          return;
        }

        var cal = ical({
          domain: 'birdboxbluebook.com',
          prodId: { company: 'BBBB', product: 'BBBB' },
          name: 'BBBB',
          floating: true
        });

        const DATEA = moment('2019-01-14');
        // const DATEB = moment('2019-04-26');
        const DIFF = 102;

        for (var i = 0; i <= DIFF; i++) {
          var thedate = DATEA.clone().add(i, 'days');
          var theday = thedate.format('dddd');

          if (thedate.unix() === moment('2019-01-18').unix()) {
            theday = 'Monday';
          } else if (thedate.unix() === moment('2019-01-21').unix()) {
            continue;
          } else if (thedate.unix() >= moment('2019-03-09').unix() && thedate.unix() < moment('2019-03-25').unix()) {
            continue;
          }

          // loop through chosen courses
          for (var j = 0; j < this.chosens.length; j++) {
            var thecourse = this.chosens[j];
            var thetimesbyday = thecourse.timesbyday;

            if (!(theday in thetimesbyday)) {
              continue;
            }

            var thesessions = thetimesbyday[theday];
            for (var k = 0; k < thesessions.length; k++) {
              var thesess = thesessions[k];
              cal.createEvent({
                start: moment([2019, thedate.month(), thedate.date(), thesess.starthour, thesess.startmin]),
                end: moment([2019, thedate.month(), thedate.date(), thesess.endhour, thesess.endmin]),
                summary: [thecourse.subject, thecourse.number].join(' '),
                description: [thecourse.long_title, thecourse.subject + ' ' + thecourse.number + ' (' + thecourse.section + ')', thecourse.professors.join(', '), thecourse.description].join(' / '),
                location: thesess.location,
                allDay: false
              });
            }
          }
        }

        cal.createEvent({
          start: moment('2019-08-28'),
          summary: 'First Day of Classes',
          allDay: true
        });
        cal.createEvent({
          start: moment('2019-11-22'),
          summary: 'November Recess Begins',
          allDay: true
        });
        cal.createEvent({
          start: moment('2019-12-2'),
          summary: 'November Recess Ends',
          allDay: true
        });
        cal.createEvent({
          start: moment('2019-12-6'),
          summary: 'Last Day of Classes',
          allDay: true
        });
        cal.createEvent({
          start: moment('2019-12-18'),
          summary: 'Last Day of Exams',
          allDay: true
        });

        var calstring = cal.toString();
        calstring = calstring.replace(/(?:\r\n|\r|\n)/g, '%0A');
        $('#exportbutton').attr('href', 'data:text/calendar;charset=utf8,' + calstring);
      }
    },
  });
  return thevue;
}

////////////////

exports.run = run;
