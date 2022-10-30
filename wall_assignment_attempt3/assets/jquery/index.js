$(document).ready(function(){
    $("body").on("submit", "#registration_form", submitRegistrationForm)
             .on("submit", "#login_form", submitLoginForm)
             .on("submit", "#message_form", submitMessageForm)
             .on("click", ".post_comment_button", prepareCommentForm)
             .on("submit", "#comment_form", submitCommentForm)
             .on("submit", "#message_delete_form", submitMessageDeleteForm)
             .on("click", ".delete_button", prepareMessageDeleteForm)

});

function prepareMessageDeleteForm(e){
    e.preventDefault();
    let message_item = $(this).closest(".message_item");


    $("#message_delete_form").find("#message_id_delete_input").val($(message_item).attr("data-message-item"));


    $("#message_delete_form").trigger("submit");
}

function submitMessageDeleteForm(e){
    e.preventDefault();

    let message_delete_form = $(this);
    let is_processing = $(this).attr("data-is-processing");

    if(parseInt(is_processing) === 0){
        $(message_delete_form).attr("data-is-processing", 1)

        $.post(message_delete_form.attr('action'), message_delete_form.serialize(), function(data){
            $(message_delete_form).attr("data-is-processing", 0)

            if(data.status){
                $("#message_item_"+data.result.message_id).remove()
                // $(".message_list").prepend(data.html_data)

            }
            else{
                alert(data.message);
            }

        }, "json");
    }

    return false;
}

function prepareCommentForm(e){
    e.preventDefault();

    let message_item = $(this).closest(".message_item");

    console.log( $(message_item).attr("data-message-item") )
    console.log( $(this).siblings(".textarea_comment").val() )

    $("#comment_form").find("#message_id_input").val($(message_item).attr("data-message-item"));
    $("#comment_form").find("#comment_input").val($(this).siblings(".textarea_comment").val());

    $("#comment_form").trigger("submit");
}



function submitMessageForm(e){
    e.preventDefault();

    let comment_form = $(this);
    let is_processing = $(this).attr("data-is-processing");

    if(parseInt(is_processing) === 0){
        $(comment_form).attr("data-is-processing", 1)

        $.post(comment_form.attr('action'), comment_form.serialize(), function(data){
            $(comment_form).attr("data-is-processing", 0)

            if(data.status){

                $(".message_list").prepend(data.html_data)

            }
            else{
                alert(data.message);
            }

        }, "json");
    }

    return false;
}

function submitCommentForm(e){
    e.preventDefault();

    let message_form = $(this);
    let is_processing = $(this).attr("data-is-processing");

    if(parseInt(is_processing) === 0){
        $(message_form).attr("data-is-processing", 1)

        $.post(message_form.attr('action'), message_form.serialize(), function(data){
            $(message_form).attr("data-is-processing", 0)

            if(data.status){

                $(".message_item").find("#comment_list_"+data.result.message_id).append(data.html_data);

                $(message_form)[0].reset();

                $(".textarea_comment").val();
            }
            else{
                alert(data.message);
            }

        }, "json");
    }

    return false;
}

function submitLoginForm(e){
    e.preventDefault();

    let login_form = $(this);
    let is_processing = $(this).attr("data-is-processing");

    if(parseInt(is_processing) === 0){
        $(login_form).attr("data-is-processing", 1)

        $.post(login_form.attr('action'), login_form.serialize(), function(data){
            $(login_form).attr("data-is-processing", 0)
            if(data.status){

                window.location.href =  "/home";

            }
            else{
                alert(data.message);
            }

        }, "json");
    }

    return false;
}

function submitRegistrationForm(e){
    e.preventDefault();

    let reg_form = $(this);
    let is_processing = $(this).attr("data-is-processing");

    if(parseInt(is_processing) === 0){
        $(reg_form).attr("data-is-processing", 1)

        $.post(reg_form.attr('action'), reg_form.serialize(), function(data){
            if(data.status){
                $(reg_form).attr("data-is-processing", 0)

                alert("Successfully registered")

            }
            else{
                alert(data.message);
            }

        }, "json");
    }

    return false;
}