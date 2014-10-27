$(function() {

  $(':checkbox').click(function() {
    $(this).parents('tr').toggleClass('selected');

    if ($(':checkbox:checked').length > 0) {
      $('#delete').slideDown('fast');
    } else {
      $('#delete').slideUp('fast');
    }
  });

  $('#type').change(function() {
    var showClass = $("option:selected", this).data('show-class');
    $('.show-class').hide().filter('input').val('');

    if (showClass) {
      $('.' + showClass).show();
    }
  });

  $('input#date').datepicker();

});
