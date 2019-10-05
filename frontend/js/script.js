$(document).ready(function(){
    $('#datepicker').datepicker({
        uiLibrary: 'bootstrap'
    });

    $('.btn').on('click', function(){
        var patient_name = $('#patient_name').val();
        var visiting_date = $('#datepicker').val();
        var consultant_name = $('#consultant_name').val();
        var comments = $('#comments').val();
        var image = $('imageUpload').val();
        console.log(patient_name);
        console.log(visiting_date);
        console.log(consultant_name);
        console.log(comments);
        console.log(image);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                console.log(e.target.result); 
                $('#imagePreview').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function() {
        readURL(this);
    });
});