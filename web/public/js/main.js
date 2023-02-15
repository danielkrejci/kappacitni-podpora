$(document).ready(function(){

    $('[data-toggle="tooltip"]').tooltip({container: 'body', boundary: 'viewport' /*window*/});
    $("[rel='tooltip']").tooltip({container: 'body', boundary: 'viewport'});
    $("[data-rel='tooltip']").tooltip({container: 'body', boundary: 'viewport'});
    $('[data-toggle="popover"]').popover({ trigger: "hover" });
    if ($('select:not(.not-select2)').length > 0) {
        $('select:not(.not-select2)').each(function () {
            if($(this).hasClass('hide-select-search-box')){
                $(this).select2({width: '100%', minimumResultsForSearch: Infinity});
            }else{
                $(this).select2({width: '100%', minimumResultsForSearch: '8'});
            }
        });
        // If default value is selected, disable searching and changing the value
        $(".select2-search input").prop("readonly", true);
    }
    // For the Second level Dropdown menu, highlight the parent
    $( ".dropdown-menu" )
        .mouseenter(function() {
            $(this).parent('li').addClass('active');
        })
        .mouseleave(function() {
            $(this).parent('li').removeClass('active');
        });

    if ($('.art-ajax').length > 0) {
        // ARTv3.0
        $('.art-ajax').on('submit', function(e) {
            e.preventDefault();  //prevent form from submitting
            // check if notifybox exists and optionally create it
            if ($(this).find(".notifybox").length == 0) {
                $(this).prepend('<div class="notifybox"></div>');
            }
            // find the form data...
            var action = $(this).attr('action'),
                method = $(this).attr('method'),
                form = $(this),
                hasCaptcha = false;
            var hasEnctype = false;
            form.find(".notifybox").html("");
            if (form.attr("enctype") == "multipart/form-data") {hasEnctype = true;}
            if (hasEnctype == true) {
                var data = new FormData()
            } else {
                var data = $(this).serializeArray();
            }
            // get elements items first
            var disabledElements = new Array();
            $("*:disabled").each(function() {
                disabledElements.push($(this));
            });
            form.find('input, textarea, button, select').attr('disabled', true);
            if(form.data('loading-theme')){
                form.loading({
                    theme: form.data('loading-theme'),
                    message: '<img src="/components/img/loader.svg?v='+(new Date().getTime())+'" style="width: 50px; height: 50px; opacity: 0.8;">', zIndex: 1000000
                });
            }else{
                form.loading({
                    message: '<img src="/components/img/loader.svg?v='+(new Date().getTime())+'" style="width: 50px; height: 50px; opacity: 0.8;">', zIndex: 1000000
                });
            }
            if (action == undefined ) {
                form.find(".notifybox").html(wrapalert("<b>Error submitting form:</b><br>Missing action attribute. Try to refresh this page or feel free to contact us if the problem persists."));
                form.find('input, textarea, button, select').attr('disabled', false);
                return false;
            }
            if (method == undefined ) method="post"; // if not stated, the default form method is POST.

            if(hasEnctype == true) {
                form.find("input, textarea, select").each(function(index, element){
                    if ($(element).attr('type') == "file") {
                        data.append($(element).attr("name"), $(element)[0].files[0]);
                    } else {
                        data.append($(element).attr("name"), $(element).val());
                    }
                });
            } else {
                // look for password inputs - these must be hashed
                if (form.find(".hashedpwd").length > 0) {
                    // save input names to array
                    var inputstohash = new Array();
                    form.find(".hashedpwd").each(function(index, element){
                        inputstohash.push($(element).attr("name"));
                    });
                    // edit values in serialized array
                    for( var i = 0, len = data.length; i < len; i++ ) {
                        if( inputstohash.indexOf(data[i]["name"]) !== -1 ) {
                            data[i]["value"] = hex_sha512(data[i]["value"]);
                        }
                    }
                }
            }

            if (form.find("[name=g-recaptcha-response]").length > 0) {
                hasCaptcha = true;
            }
            var params = {
                url : action,
                type: method,
                data : data,
                dataType: "json"
            };
            if(hasEnctype == true) {
                params.contentType = false;
                params.processData = false;
            }
            params.success = function(returndata)
            {
                // handle with results
                if(returndata.saveafter) {
                    changed = false;
                }
                if(returndata.cleanform && returndata.cleanform == 1) {
                    form.html("").prepend('<div class="notifybox"></div>');
                }
                if(returndata.redirectto && returndata.redirectto != "") {
                    window.location.href = returndata.redirectto;
                }
                if(returndata.refreshafter || returndata.refreshafter == 0) {
                    if (returndata.refreshafter == 0) {
                        window.location.reload();
                    } else {
                        setTimeout(function () { window.location.reload(); }, parseInt(returndata.refreshafter) * 1000);
                    }
                }
                if(returndata.closemodal) {
                    $(returndata.closemodal).modal('hide');
                }
                if(returndata.changebtn) {
                    form.find("button[type=submit]").html(returndata.changebtn);
                }
                if(returndata.reloadMasonry == true){
                    setTimeout(function () {
                        $('.box-container').masonry();
                    }, 500);
                }

                $(this).find(".notifybox").html("");
                switch (returndata.result) {
                    case "error":
                        form.find(".notifybox").html(wrapalert(returndata.message));
                        break;
                    case "alert":
                        var subtitle = "",
                            errtype = "error";
                        if (returndata.subtitle) {
                            subtitle = returndata.subtitle
                        }
                        if (returndata.errtype) {
                            errtype = returndata.errtype
                        }
                        swal(returndata.message, subtitle, errtype);
                        break;
                    case "showmessage":
                        form.find(".notifybox").html(wrapalert(returndata.message, returndata.msgtype));
                        break;
                    case "success":
                        if (returndata.newhtml) {
                            form.prepend(returndata.newhtml);
                        } else {
                            form.find(".notifybox").html(wrapalert(returndata.message, "success"));
                        }
                        break;
                    case "toast":
                        if (returndata.ttype == "success") {
                            toastr.success(returndata.message);
                        } else if (returndata.ttype == "error") {
                            toastr.error(returndata.message);
                        } else if (returndata.ttype == "warning") {
                            toastr.warning(returndata.message);
                        } else {
                            toastr.info(returndata.message);
                        }
                        break;
                    case "htmlmsg":
                        form.prepend(returndata.newhtml);
                        break;
                }
                if (form.find("[name=g-recaptcha-response]").length > 0) {
                    grecaptcha.reset()
                }
                if(!(returndata.redirectto && returndata.redirectto != "") && !(returndata.refreshafter || returndata.refreshafter == 0)) {
                    form.loading('stop').find('input, textarea, button, select').attr('disabled', false);
                    $.each( disabledElements, function( key, value ) {
                        value.attr('disabled', true);
                    });
                }
                if (returndata.affecthtml) {
                    for (var k in returndata.affecthtml){
                        if (returndata.affecthtml.hasOwnProperty(k)) {
                            if ($(k).length > 0) {
                                $(k).html(returndata.affecthtml[k]);
                            }
                        }
                    }
                }
                disabledElements = null;
            };
            params.error = function(xhr) {
                form.find(".notifybox").html(wrapalert("<b>Chyba při odesílání požadavku:</b><br>Obnovte prosím stránku a zkuste to znovu. V případě přetrvávajících problémů nás kontaktujte.<br><br>Odpověď serveru: "+xhr.statusText));
                if (hasCaptcha == true) {
                    grecaptcha.reset()
                }
                form.loading('stop').find('input, textarea, button, select').attr('disabled', false);
                $.each( disabledElements, function( key, value ) {
                    value.attr('disabled', true);
                });
                disabledElements = null;
            };
            $.ajax(params);
        });
    }

});

function wrapalert(text, type) {
    switch (type) {
        case "info":
            return '<div class="alert alert-info" role="alert">' + text + '</div>';
            break;
        case "success":
            return '<div class="alert alert-success" role="alert">' + text + '</div>';
            break;
        case "warning":
            return '<div class="alert alert-warning" role="alert">' + text + '</div>';
            break;
        default:
            return '<div class="alert alert-danger" role="alert">' + text + '</div>';
            break;
    }
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// fix select2.js typing bug in modal
$.fn.modal.Constructor.prototype.enforceFocus = $.noop;
