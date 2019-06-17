import $ from 'jquery';
import _ from 'lodash';
import { registerEvent, getData } from './init';
import { mount, EvaluationModal } from '../jsNew/All';

const templatePath = '/templates';
const coursesTakenPrompted = window.coursesTakenPrompted; // Set to 'Shared' if prompted already

export default function ModalsManager(
  urlManager,
  worksheetManager,
  season,
  evaluationsEnabled
) {
  let textbooksTemplate;

  const that = this;
  this.season = season;

  $.fn.attachKeyboardScroll = function() {
    const $elem = this;
    const $modalBody = $elem.find('.modal-body');
    $elem.off('keydown').on('keydown', e => {
      let toAdd = 0;
      switch (e.keyCode) {
        case 33:
          toAdd -= 350;
          break;
        case 34:
          toAdd += 350;
          break;
        case 38:
          toAdd -= 40;
          break;
        case 40:
          toAdd += 40;
          break;
      }
      if (toAdd !== 0) {
        e.preventDefault();
        $modalBody.scrollTop($modalBody.scrollTop() + toAdd);
      }
    });
    return this;
  };

  //
  // Textbooks modal
  //
  function showTextbooks(textbooks, courseData) {
    const html = textbooksTemplate.render({
      textbooks: textbooks,
      course: courseData,
    });

    registerEvent('showTextbooks', {
      subject: courseData.subject,
      number: courseData.number,
      section: courseData.section,
      season: that.season,
    });

    $('.course-modal').modal('hide');
    $('.course-modal').replaceWith(html);
    $('.course-modal')
      .attachKeyboardScroll()
      .modal();
    $('#back-button').click(() => {
      showCourse(courseData);
    });

    $('.btn-offer').tooltip();

    fitModalToWindow();
  }

  //
  // Evaluations modal
  //
  const evaluations = {};
  function showEvaluation(evaluationId, courseData) {
    const evaluation = evaluations[evaluationId];
    console.log(evaluation);

    registerEvent('showEvaluation', {
      subject: courseData.subject,
      number: courseData.number,
      section: courseData.section,
      season: that.season,
    });

    let $modal = $('.course-modal');
    $modal.modal('hide');
    $modal.replaceWith('<div class="course-modal modal" tabindex="-1"></div>');

    // Need to rebind after replaceWith
    $modal = $('.course-modal');
    $modal.attachKeyboardScroll().modal();

    // Attach the React component
    mount(EvaluationModal, $modal[0], {
      evaluation: evaluation,
      onClose: function() {
        showCourse(courseData);
      },
    });

    fitModalToWindow();
  }

  function $showEvalButton(id) {
    return $('#show-eval' + id);
  }

  urlManager.setParser(
    'course',
    data => {
      // encode
      return data.subject + '_' + data.number + '_' + data.section;
    },
    str => {
      // decode
      const parts = str.split('_');
      if (parts.length < 3) return;

      const subject = parts[0],
        number = parts[1],
        section = parts[2];

      const index = _.get(courseIndices, [subject, number, section]);

      const data = getData();
      if (index && data[index]) {
        showCourse(data[index]);
      }
    }
  );

  urlManager.setParser(
    'eval',
    data => {
      // encode
      return data.id;
    },
    () => {
      // decode
    }
  );

  urlManager.setParser(
    'textbooks',
    data => {
      // encode
      return data.subject + '_' + data.number + '_' + data.section;
    },
    () => {
      // decode
    }
  );

  function fetchEvaluations(evaluationIds, callback) {
    return $.get(
      '/GetEvaluations.php',
      { evaluationIds: evaluationIds },
      data => {
        if (data.success) {
          $.extend(evaluations, data.data);
        }
        callback(data);
      },
      'json'
    );
  }

  let template;

  //
  // Course modal
  //
  function updateAddOrRemoveButton(ociId) {
    const $courseModal = $('#course-modal' + ociId);

    if (!$courseModal.length) return;

    const callback = function() {
      updateAddOrRemoveButton(ociId);
    };

    const $button = $courseModal.find('.add-remove-worksheet');
    $button.unbind('click').prop('disabled', false);
    if (worksheetManager.isCourseInWorksheet(ociId)) {
      $button
        .click(() => {
          $button.prop('disabled', true);
          worksheetManager.addOrRemoveForWorksheet(ociId, 'remove', callback);
        })
        .html('<i class="icon-minus"></i> Remove from worksheet');
    } else {
      $button
        .click(() => {
          $button.prop('disabled', true);
          worksheetManager.addOrRemoveForWorksheet(ociId, 'add', callback);
        })
        .html('<i class="icon-plus"></i> Add to worksheet');
    }
  }

  function showCourse(courseData) {
    if (window.history) {
      window.history.pushState(
        null,
        courseData.long_title,
        urlManager.encode('course', courseData)
      );
    }
    registerEvent('showCourse', {
      subject: courseData.subject,
      number: courseData.number,
      section: courseData.section,
      season: that.season,
    });

    // Destroy any existing modals
    $('.course-modal').modal('hide');
    $('.course-modal').remove();

    const html = template.render({
      course: courseData,
      season: that.season,
      coursesTakenPrompted: coursesTakenPrompted,
      evaluationsEnabled: evaluationsEnabled,
    });
    $('body').append(html);

    const $modal = $('.course-modal');
    $modal.on('hidden', () => {
      window.history.pushState(null, '', urlManager.encode(''));
    });

    // Retrieve evaluations if we're missing them
    const allEvaluations = courseData.evaluations.same_both.concat(
      courseData.evaluations.same_professors,
      courseData.evaluations.same_class
    );

    function showEvalGenerator(id) {
      return function() {
        showEvaluation(id, courseData);
      };
    }

    for (let i = 0; i < allEvaluations.length; i++) {
      const evaluation = allEvaluations[i];
      $showEvalButton(evaluation.id).click(showEvalGenerator(evaluation.id));
    }

    const missingEvaluations = $.map(allEvaluations, evaluation => {
      return evaluation.id in evaluations ? null : evaluation.id;
    });

    if (missingEvaluations.length !== 0) {
      console.log('Need to fetch ' + missingEvaluations);
      for (let i = 0; i < missingEvaluations.length; i++) {
        const id = missingEvaluations[i];
        $('#show-eval' + id).attr('disabled', 'disabled');
      }
      fetchEvaluations(missingEvaluations, data => {
        if (data.success) {
          $('.course-modal .eval-button').removeAttr('disabled');
        }
      });
    }

    // Set the button for adding to worksheet appropriately
    updateAddOrRemoveButton(courseData.oci_id);

    // Add tooltips so that we know what bars mean
    $('.eval-button, .textbooks-button').tooltip();
    $('.rating-bar').tooltip({ title: 'Overall (5 for Excellent)' });
    $('.difficulty-bar').tooltip({ title: 'Workload (5 for Much greater)' });

    // // Get textbooks if we're missing them
    // var $textbooksButton = $modal.find('.show-textbooks');
    // // $textbooksButton.hide();

    // const textbooksButtonHtml = $textbooksButton.html();
    // $textbooksButton.attr('disabled', 'disabled').html(textbooksButtonHtml + ' (loading)');
    // $.get('/GetTextbooksNew.php', {
    //   subject: courseData.subject,
    //   number: courseData.number,
    //   section: courseData.section,
    //   season: that.season
    // }, function(data) {
    //   if (data.success) {
    //     const textbooks = data.textbooks;
    //     if ($.isEmptyObject(textbooks)) {
    //       $textbooksButton.html('<i class="icon-book"></i> No textbooks listed');
    //     } else {
    //       $textbooksButton.removeAttr('disabled').html(textbooksButtonHtml).click(function(e) {
    //         showTextbooks(textbooks, courseData);
    //       });
    //     }
    //     console.log(data);
    //   } else {
    //     $textbooksButton.hide();
    //   }
    // }, 'json');

    $modal.attachKeyboardScroll().modal();

    fitModalToWindow();
  }

  function fitModalToWindow() {
    console.log(
      'Setting modal body height to ' + ($(window).height() - 80) * 0.85
    );
    $('.modal-body').css('max-height', ($(window).height() - 100) * 0.85);
  }

  $(document).ready(() => {
    // template = new EJS({ url: templatePath + '/CourseModal.ejs' });
    // evaluationTemplate = new EJS({ url: templatePath + '/EvaluationModal.ejs' });
    // textbooksTemplate = new EJS({ url: templatePath + '/TextbookModal.ejs' });

    // Precache templates
    const templates = [
      'CourseModal.ejs',
      'TextbookModal.ejs',
      'EvaluationBarGraph.ejs',
      'Bar.ejs',
      'HistogramComponent.ejs',
      'TextbooksTable.ejs',
      'EvaluationComments.ejs',
      'EvaluationButton.ejs',
    ];
    for (let i = 0; i < templates.length; i++) {
      const tplName = templates[i];
      const url = templatePath + '/' + tplName;
      $.get(
        url,
        null,
        (function(url, tplName) {
          return function(done) {
            const ejs = new EJS({ text: done, name: url });
            if (tplName === 'CourseModal.ejs') {
              template = ejs;
            } else if (tplName === 'TextbookModal.ejs') {
              textbooksTemplate = ejs;
            }
          };
        })(url, tplName),
        'text'
      );
    }

    /*
    $(window).scroll(function() {
      adjustModalPosition();
    });
    */
  });

  this.showCourse = showCourse;
  this.showEvaluation = showEvaluation;
  this.showTextbooks = showTextbooks;
}
