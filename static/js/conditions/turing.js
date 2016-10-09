var clip, trial_start
var clip_files = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]
var clip_played = []
//humans: 1; computers: 0
var clip_answers = [0,1,1,1,1,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,1,1,1,0,0,1,1,0,1,0,1,0,1,1,1,1,1,1,0,0,0,1,0,1,0,0,0,1,1,1,0,1,0,1,1,0,0,1,1,1,0,0,1,0,0,0,0,1,1,0,0,1,1,1,1,0,0]

var stim_source = $('#stim-source') //document.getElementById('stim-source');
var player = document.getElementById('turing-stim');

player.defaultPlaybackRate = 1.1

$(window).load(function(){
    $('#welcome-modal').modal('show');
});

$(document).ready(function() {
    i = Math.floor(Math.random() * clip_files.length);
    clip = clip_files[i]
    $('.slidertext').hide();
    initPlayer();
    loadVideo(clip);
    trial_start = Date.now();
    $('.submit-btn').on('click', function(e) { submitHandler(e); }).prop('disabled', true).hide();
    $('.play-btn').on('click', function(e) { playHandler(e); });
    player.addEventListener('ended',function(e) { endHandler(e); });
    $('#slider').on('click', function(e) { sliderchangeHandler(e); }).hide();

})

function initPlayer() {
    player.controls = false;
}

function loadVideo(clipno) {
    // add optional callback
    stim_source.attr('src', getClip(clipno));
    player.load();
    $('#slider').prop('disabled', true).hide();
    $('.play-btn').prop('disabled', false);

}

function playHandler(e){
    player.play();
    document.getElementById('play').value = "Play next";
    $('.play-btn').prop('disabled', true).hide();
    $('#feedbacktext').text("");
}

function endHandler(e){
    $('#slider').prop('disabled', false).fadeIn('slow');
    $('.slidertext').fadeIn();
}

function sliderchangeHandler(e){
    $('.submit-btn').prop('disabled', false);
    $('.submit-btn').fadeIn('slow');
}

function submit_response(val) {
    var response = {
        choice: val,
        start: trial_start,
        timestamp: Date.now(),
        clip_id: clip
    }

    return $.ajax({type: 'POST', url: '/turing', dataType:'JSON', data:response})
}

function submitHandler(e) {
    var val = $('#slider').val();
    feedback = ((val>=50) == clip_answers[i]);
    $('#slider').val(49)
    //$('#feedbacktext').text(String(feedback));
    if (feedback == 1){
        $('#slider').hide().promise().done(function(){
            $('#feedbacktext').text("Yes, that was correct!").fadeIn('slow');})
    }
    else{
        $('#slider').hide().promise().done(function(){
            $('#feedbacktext').text("Sorry, that was not correct.").fadeIn('slow');})
    }
    res = submit_response(val);
    res.done(console.log('Data sent!'));
    clip_played.push(clip_files[i]);
    clip_files.splice(i,1);
    clip_answers.splice(i,1);
    if (clip_files.length!==0){
        i = Math.floor(Math.random() * clip_files.length);
    }
    else{
        $('#end-modal').modal('show');
    }

    clip = clip_files[i];
    $('.submit-btn').prop('disabled', true).hide();
    $('#slider').fadeOut('slow').promise().done(function(){
            $('.play-btn').fadeIn('slow');
            loadVideo(clip);})
    $('.slidertext').hide();

}

function getClip(clipno) {
    var clip_prefix = '../static/media/video/turing_videos/'
    return clip_prefix + String(clipno) + '.mp4'
}
